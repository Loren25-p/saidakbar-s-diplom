// MainPage.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import {
  MainContainer,
  HeroSection,
  FreelancerCard,
  CardButton,
  SearchInput,
  CardGrid,
  SearchContainer,
  SearchIcon,
  SearchButton,
  ProfileContainer,
  ProfileDetails,
  StarIcon
} from './MainPage.styled'; 
import axios from 'axios';

interface Freelancer {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  specialty: string;
  description: string;
}

const professions = [
  'Web Developer', 'Graphic Designer', 'Content Writer', 'SEO Specialist',
  'Digital Marketer', 'Mobile App Developer', 'UX/UI Designer',
  'Data Analyst', 'Project Manager', 'Photographer'
];

const MainPage: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user?.isAuthenticated ?? false); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [shouldShowFreelancers, setShouldShowFreelancers] = useState(false);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [localFreelancers, setLocalFreelancers] = useState<Freelancer[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await axios.get('https://api.github.com/users?per_page=50');
        const data = response.data.map((user: any, index: number) => ({
          ...user,
          specialty: professions[index % professions.length],
          description: 'Опытный специалист в своей области с отличным портфолио и отзывами.',
        }));
        setFreelancers(data);
      } catch (error) {
        console.error('Ошибка при получении данных фрилансеров:', error);
      }
    };

    if (shouldShowFreelancers) {
      fetchFreelancers();
    }
  }, [shouldShowFreelancers]);

  useEffect(() => {
    const savedFreelancers = localStorage.getItem('localFreelancers');
    if (savedFreelancers) {
      setLocalFreelancers(JSON.parse(savedFreelancers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('localFreelancers', JSON.stringify(localFreelancers));
  }, [localFreelancers]);

  // Фильтрация фрилансеров на главной странице
  const filteredFreelancers = freelancers.filter((freelancer) =>
    freelancer.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !localFreelancers.some((favorite) => favorite.id === freelancer.id)
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setShouldShowFreelancers(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShouldShowFreelancers(true);
    }
  };

  const handleViewProfile = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
  };

  const handleGoToFavorites = () => {
    navigate('/favorites');
  };

  const handleAddToFavorites = (freelancer: Freelancer) => {
    // Проверяем, добавлен ли уже фрилансер в избранное
    const isAlreadyFavorite = localFreelancers.some((favorite) => favorite.id === freelancer.id);

    if (!isAlreadyFavorite) {
      // Если не добавлен, добавляем в избранное
      const updatedFavorites = [...localFreelancers, freelancer];
      setLocalFreelancers(updatedFavorites);
    } else {
      // Если добавлен, удаляем из избранного
      const updatedFavorites = localFreelancers.filter((favorite) => favorite.id !== freelancer.id);
      setLocalFreelancers(updatedFavorites);
    }
  };

  return (
    <MainContainer>
      <HeroSection>
        <h1>Найдите лучших фрилансеров для вашего проекта</h1>
        <p>Просматривайте профили, отзывы и предложения, чтобы найти идеального фрилансера для вашей задачи.</p>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Поиск по профессии..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <SearchButton onClick={handleSearchButtonClick}>
            <SearchIcon />
          </SearchButton>
        </SearchContainer>
        <CardButton onClick={handleGoToFavorites}>Перейти в избранное</CardButton>
      </HeroSection>

      {selectedFreelancer ? (
        <ProfileContainer>
          <ProfileDetails>
            <img src={selectedFreelancer.avatar_url} alt="avatar" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            <h2>{selectedFreelancer.login}</h2>
            <p>Специальность: {selectedFreelancer.specialty}</p>
            <p>Описание: {selectedFreelancer.description}</p>
            <p>Ссылка на профиль: <a href={selectedFreelancer.html_url} target="_blank" rel="noopener noreferrer">Перейти на GitHub</a></p>
            <CardButton onClick={() => setSelectedFreelancer(null)}>Вернуться к списку</CardButton>
          </ProfileDetails>
        </ProfileContainer>
      ) : (
        shouldShowFreelancers && (
          <CardGrid>
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id}>
                  <img src={freelancer.avatar_url} alt="avatar" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                  <h2>{freelancer.login}</h2>
                  <p>Специальность: {freelancer.specialty}</p>
                  {/* Используем символ галочки вместо CheckIcon */}
                  <StarIcon 
                    onClick={() => handleAddToFavorites(freelancer)} 
                    style={{ cursor: 'pointer' }}
                  >
                    {localFreelancers.some(f => f.id === freelancer.id) ? '✔️' : '⭐'}
                  </StarIcon>
                  <CardButton onClick={() => handleViewProfile(freelancer)}>Просмотреть профиль</CardButton>
                </FreelancerCard>
              ))
            ) : (
              <p>Фрилансеры не найдены. Попробуйте изменить запрос для поиска.</p>
            )}
          </CardGrid>
        )
      )}
    </MainContainer>
  );
};

export default MainPage;
