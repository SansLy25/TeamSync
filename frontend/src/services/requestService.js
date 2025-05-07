// Имитируем запросы
let requests = [
  {
    id: '1',
    creator: '1',
    game: 'League of Legends',
    description: 'Looking for a support main to duo with. Gold rank, play mostly evenings.',
    createdAt: new Date().toISOString(),
    preferences: 'Mic required, non-toxic players only'
  },
  {
    id: '2',
    creator: '2',
    game: 'Minecraft',
    description: 'Starting a new survival server, looking for creative builders to join our community.',
    createdAt: new Date().toISOString(),
    preferences: 'Any experience level welcome, must be 18+'
  },
  {
    id: '3',
    creator: '3',
    game: 'Fortnite',
    description: 'Need a squad for Arena mode. I am trying to reach Champion division.',
    createdAt: new Date().toISOString(),
    preferences: 'Looking for players who can build well and have good game sense'
  }
];

// Получаем все запросы
export const getAllRequests = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(requests);
    }, 500);
  });
};

// Получаем заявку по id
export const getRequestById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const request = requests.find(req => req.id === id);
      if (request) {
        resolve(request);
      } else {
        reject(new Error('Заявка не найдена'));
      }
    }, 300);
  });
};

// Создаем новую заявку
export const createRequest = (requestData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRequest = {
        id: String(requests.length + 1),
        ...requestData,
        createdAt: new Date().toISOString()
      };
      
      requests.push(newRequest);
      resolve(newRequest);
    }, 500);
  });
};

// Обновляем запрос
export const updateRequest = (id, updatedData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requestIndex = requests.findIndex(req => req.id === id);
      if (requestIndex !== -1) {
        requests[requestIndex] = {
          ...requests[requestIndex],
          ...updatedData
        };
        resolve(requests[requestIndex]);
      } else {
        reject(new Error('Заявка не найдена'));
      }
    }, 300);
  });
};

// Удаляем запрос
export const deleteRequest = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const requestIndex = requests.findIndex(req => req.id === id);
      if (requestIndex !== -1) {
        const deletedRequest = requests[requestIndex];
        requests = requests.filter(req => req.id !== id);
        resolve(deletedRequest);
      } else {
        reject(new Error('Заявка не найдена'));
      }
    }, 300);
  });
};

// Фильтр заявок
export const filterRequests = (filters) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRequests = [...requests];
      
      if (filters.game) {
        filteredRequests = filteredRequests.filter(
          req => req.game.toLowerCase().includes(filters.game.toLowerCase())
        );
      }
      
      if (filters.searchText) {
        filteredRequests = filteredRequests.filter(
          req => req.description.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                 req.preferences.toLowerCase().includes(filters.searchText.toLowerCase())
        );
      }
      
      resolve(filteredRequests);
    }, 300);
  });
};

export const getRequestsByCreator = (creatorId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const creatorRequests = requests.filter(req => req.creator === creatorId);
      resolve(creatorRequests);
    }, 300);
  });
};