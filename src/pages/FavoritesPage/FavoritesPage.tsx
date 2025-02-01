// FavoritesPage.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MainContainer = styled.div`
  padding: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const FreelancerCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
`;

const CardButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px;
`;

const StarIcon = styled.span`
  font-size: 24px;
  margin-top: 10px;
  display: inline-block;
`;

interface Freelancer {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  specialty: string;
  description: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Freelancer[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('localFreelancers');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('localFreelancers', JSON.stringify(updatedFavorites));
  };

  return (
    <MainContainer>
      <h1>Избранные фрилансеры</h1>
      {favorites.length > 0 ? (
        <CardGrid>
          {favorites.map((freelancer) => (
            <FreelancerCard key={freelancer.id}>
              <img src={freelancer.avatar_url} alt="avatar" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
              <h2>{freelancer.login}</h2>
              <p>Специальность: {freelancer.specialty}</p>
              <StarIcon onClick={() => removeFavorite(freelancer.id)} style={{ color: 'gold', cursor: 'pointer' }}>
                ⭐
              </StarIcon>
              <CardButton onClick={() => window.open(freelancer.html_url, '_blank')}>Перейти на GitHub</CardButton>
            </FreelancerCard>
          ))}
        </CardGrid>
      ) : (
        <p>Вы ещё не добавили фрилансеров в избранное.</p>
      )}
    </MainContainer>
  );
};

export default FavoritesPage;
