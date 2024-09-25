interface TodoInterface {
    id?: number;
    name: string;
    categoryId: number;
    userId: number;
    categoryName?: string;
    userUsername?: string;
    completeDate?: string;
}

interface TodoUpdateInterface {
    name?: string;
    categoryId?: number;
    completeDate?: string;
}

export {
    TodoInterface,
    TodoUpdateInterface
}