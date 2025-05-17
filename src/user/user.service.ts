import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { getRepository } from '../shared/utils/repository.util';
import { ApiError } from '../shared/errors/api-error';

export interface UpdateProfileDto {
  fullName?: string;
  bio?: string;
  profilePicture?: string;
}

export class UserService {
  async getUserProfile(userId: string, currentUserId: string) {
    const userRepository = getRepository(User);
    const postRepository = getRepository(Post);
    
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    // Get user posts
    const posts = await postRepository.find({
      where: { author: { id: userId } },
      relations: ['likes'],
      order: { createdAt: 'DESC' }
    });
    
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      posts: posts.map(post => ({
        id: post.id,
        content: post.content,
        imageUrl: post.imageUrl,
        likesCount: post.likesCount,
        createdAt: post.createdAt,
        liked: post.likes?.some(likeUser => likeUser.id === currentUserId) || false
      }))
    };
  }

  async updateProfile(userId: string, profileData: UpdateProfileDto) {
    const userRepository = getRepository(User);
    
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    // Update only provided fields
    if (profileData.fullName !== undefined) user.fullName = profileData.fullName;
    if (profileData.bio !== undefined) user.bio = profileData.bio;
    if (profileData.profilePicture !== undefined) user.profilePicture = profileData.profilePicture;
    
    await userRepository.save(user);
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      bio: user.bio,
      profilePicture: user.profilePicture
    };
  }
}
