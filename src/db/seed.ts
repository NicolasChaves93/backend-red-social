import bcrypt from 'bcryptjs';
import dataSource from '../data-source';
import { User } from '../user/user.entity';
import { Post } from '../posts/post.entity';

export const seedDatabase = async () => {
  if (!dataSource.isInitialized) {
    console.error('No se puede inicializar la base de datos');
    return;
  }
  
  try {
    const userRepository = dataSource.getRepository(User);
    const postRepository = dataSource.getRepository(Post);
    
    // Revisar si ya existen datos en la base de datos
    const userCount = await userRepository.count();
    
    if (userCount > 0) {
      console.log('Ya existen datos en la base de datos.');
      return;
    }
    
    console.log('Comenzando la carga de datos de prueba...');
    
    // Creación de usuarios de prueba
    const testUsers = [
      {
        username: 'CarlosGomez',
        email: 'carlos.gomez@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Carlos Andres Gomez',
        bio: 'Desarrollador de software interesado en tecnologías web y móviles',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        username: 'TaniaMercedes',
        email: 'tania.mercedes@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Tania Mercedes',
        bio: 'Diseñadora UX con pasión por el diseño centrado en el usuario',
        profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      {
        username: 'AlexRemolina',
        email: 'aleander.remolina@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Alexander Remolina',
        bio: 'Desarrollador Full-stack y entusiasta de la fotografía.',
        profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg'
      }
    ];
    
    const users = userRepository.create(testUsers);
    const savedUsers = await userRepository.save(users);
    
    console.log(`Creados ${savedUsers.length} usuarios de prueba`);
    
    // Crear Posts de prueba
    const posts = [
      {
        content: 'Acabo de terminar de crear mi primera aplicación React. ¡Aprender nuevos frameworks siempre es emocionante!',
        author: savedUsers[0],
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        likes: [],
        likesCount: 0
      },
      {
        content: 'Trabajando en un nuevo proyecto de diseño. La UI/UX se centra en comprender las necesidades del usuario.',
        author: savedUsers[1],
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
        likes: [],
        likesCount: 0
      },
      {
        content: 'Explorando la arquitectura de microservicios para aplicaciones escalables. ¿Cuál es tu experiencia con ella?',
        author: savedUsers[2],
        imageUrl: 'https://images.unsplash.com/photo-1573495627361-d9b87960b12d',
        likes: [],
        likesCount: 0
      }
    ];
    
    const createdPosts = postRepository.create(posts);
    await postRepository.save(createdPosts);
    
    console.log(`Creados ${createdPosts.length} posts de prueba`);
    console.log('Base de datos inicializada con datos de prueba.');
  } catch (error) {
    console.error('Error al enviar datos a la base de datos:', error);
    throw error;
  }
};
