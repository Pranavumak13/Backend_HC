import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/users.model.js';
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const generateAccessAndRefreshToken = async userId => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(489, 'No user found');
  }

  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshTokens = refreshToken;
    await user.save({validateBeforeSave: false});
    return {accessToken, refreshToken};
  } catch (error) {
    throw new ApiError(490, 'Something went wrong while generating the access or refresh token');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {username, email, fullname, password} = req.body;

  //validation
  if ([username, email, fullname, password].some(field => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are requried');
  }

  // if user already exist
  const existedUser = await User.findOne({
    $or: [{username}, {email}],
  });

  if (existedUser) {
    throw new ApiError(484, 'User with email or username already exist!!');
  }

  // for Avatar and CoverImage

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(485, 'Avatar File is missing');
  }
  if (!coverImageLocalPath) {
    throw new ApiError(486, 'Cover Image File is missing');
  }

  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log('Uploaded Avatar', avatar);
  } catch (error) {
    console.log('Error uploading avatar', error);
    throw new ApiError(487, 'Failed to upload avatar');
  }
  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log('Uploaded CoverImage', coverImage);
  } catch (error) {
    console.log('Error uploading coverImage', error);
    throw new ApiError(488, 'Failed to upload coverImage');
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      fullname,
      password,
      avatar: avatar?.url,
      coverImage: coverImage?.url || '',
    });

    // to make sure user is created we can query the id
    // in mongodb, to deselect the field we can add '-' at its begining
    const createdUser = await User.findById(user._id).select('-password -refreshTokens');

    if (!createdUser) {
      throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(new ApiResponse(200, createdUser, 'User registed successfully'));
  } catch (error) {
    console.log('User Creation Failed', error);
    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new ApiError(
      500,
      'Something went wrong while registering a user and images were deleted'
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  // get data from body
  const {email, username, password} = req.body;

  // Required Fields
  if ([email, username, password].some(field => field?.trim() === '')) {
    throw new ApiError(491, 'All fields are required to login!');
  }

  // if user already exist
  const user = await User.findOne({
    $or: [{username}, {email}],
  });

  if (!user) {
    throw new ApiError(492, 'User not found');
  }

  // validate Password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(493, 'Invalid Credentials');
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  if (!loggedInUser) {
    throw new ApiError(493, 'User not logged in');
  }

  // options of some details to be sent to the user
  const options = {
    httpOnly: true, // makes the cookie non modifiable by client side
    secure: process.env.NODE_ENV === 'production', //secure is true when in production env
  };

  //return data
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {user: loggedInUser, accessToken, refreshToken},
        'User logged in successfully'
      )
    );
});

export {registerUser};
