

interface CategoryrProps {
    params: Promise<{
        categoryId: string;
    }>
}

const CategoryPage = async ({ params }: CategoryrProps) => {
    const { categoryId } = await params;
    return (
        <div className='p-4'>{categoryId}</div>
    )
}

export default CategoryPage;