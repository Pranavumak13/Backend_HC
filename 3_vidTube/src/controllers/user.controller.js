import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/users.model.js';
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

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
    throw new ApiError(486, 'Failed to upload avatar');
  }
  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log('Uploaded CoverImage', coverImage);
  } catch (error) {
    console.log('Error uploading coverImage', error);
    throw new ApiError(487, 'Failed to upload coverImage');
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

export {registerUser};
