import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { getRepository } from '../shared/utils/repository.util';
import { ApiError } from '../shared/errors/api-error';

export interface CreatePostDto {
  content: string;
  imageUrl?: string;
}

export class PostsService {
  async getAllPosts(userId: string) {
    const postRepository = getRepository(Post);
    
    const posts = await postRepository.find({
      relations: ['author', 'likes'],
      order: {
        createdAt: 'DESC'
      }
    });
    
    // Transform posts to remove sensitive data
    return posts.map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      likesCount: post.likesCount,
      createdAt: post.createdAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        profilePicture: post.author.profilePicture
      },
      liked: post.likes?.some(user => user.id === userId) || false
    }));
  }

  async createPost(userId: string, postData: CreatePostDto) {
    if (!postData.content) {
      throw new ApiError('El contenido es obligatorio', 400);
    }
    
    const userRepository = getRepository(User);
    const postRepository = getRepository(Post);
    
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    const post = postRepository.create({
      content: postData.content,
      imageUrl: postData.imageUrl,
      author: user,
      likes: [],
      likesCount: 0
    });
    
    await postRepository.save(post);
    
    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      likesCount: post.likesCount,
      author: {
        id: user.id,
        username: user.username,
        profilePicture: user.profilePicture
      }
    };
  }

  async toggleLike(postId: string, userId: string) {
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);
    
    const post = await postRepository.findOne({
      where: { id: postId },
      relations: ['likes']
    });
    
    if (!post) {
      throw new ApiError('Post no encontrado', 404);
    }
    
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    // Initialize likes array if undefined
    if (!post.likes) {
      post.likes = [];
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.some(likeUser => likeUser.id === userId);
    
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(likeUser => likeUser.id !== userId);
      post.likesCount = post.likes.length;
      await postRepository.save(post);
      
      return {
        liked: false,
        likesCount: post.likesCount
      };
    } else {
      // Like the post
      post.likes.push(user);
      post.likesCount = post.likes.length;
      await postRepository.save(post);
      
      return {
        liked: true,
        likesCount: post.likesCount
      };
    }
  }
}
