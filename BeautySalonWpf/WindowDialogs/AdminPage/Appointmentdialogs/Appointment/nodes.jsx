export const nodes = [
    {
        id: 1,
        title: 'Выбор услуги',
        description: 'Выберите услугу и уровень мастера',
        isRequired: true
    },
    {
        id: 2,
        title: 'Выбор даты и мастера',
        description: 'Выберите удобную дату, время и мастера',
        isRequired: true
    },
    {
        id: 3,
        title: 'Подтверждение',
        description: 'Проверьте данные записи',
        isRequired: true
    }
];

export const getNodeById = (id) => {
    return nodes.find(node => node.id === id);
};

export const getNextNode = (currentId) => {
    const currentIndex = nodes.findIndex(node => node.id === currentId);
    if (currentIndex < nodes.length - 1) {
        return nodes[currentIndex + 1];
    }
    return null;
};

export const getPreviousNode = (currentId) => {
    const currentIndex = nodes.findIndex(node => node.id === currentId);
    if (currentIndex > 0) {
        return nodes[currentIndex - 1];
    }
    return null;
}; 