import React from 'react';

const DesignFifteen = () => {
    const categories = [
        {
            name: 'Home Textiles',
            imageUrl: 'https://i0.wp.com/textilelearner.net/wp-content/uploads/2021/10/home-textiles.jpg?resize=600%2C400&ssl=1',
        },
        {
            name: 'Cozy Cushions',
            imageUrl: 'https://media.istockphoto.com/id/901195836/photo/gray-and-green-cushions-cozy-home.jpg?s=612x612&w=0&k=20&c=Pm7ZDFQ8g8vQNJ9fv6oiNWwDsF0zWS_x7C2KNQOD4R0=',
        },
        {
            name: 'Warm Blankets',
            imageUrl: 'https://www.shutterstock.com/image-photo/stack-folded-warm-blankets-different-260nw-1832271682.jpg',
        },
    ];

    return (
        <div className="max-w-screen-xl mx-auto px-3 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
                {/* Part 1: Featured Section with Enhanced Aesthetics */}
                <div className=" md:col-span-1 text-center transform transition duration-700 ease-in-out hover:scale-105 relative mr-8">
                    <div className="flex items-center p-5 text-xl font-bold text-black rounded-lg shadow-md bg-gradient-to-br h-[200px] from-red-600 to-rose-400">
                        <div className="absolute right-10 translate-x-[30%] bg-white/80 backdrop-blur-xl rounded-lg h-[120px] w-[95%] flex justify-center items-center shadow-lg">
                            <p className='text-xl font-semibold'>Our Top <br /> Category</p>
                        </div>
                    </div>
                </div>


                {/* Parts 2, 3, 4: Category Cards with Enhanced Aesthetics */}
                {categories.map((category, index) => (
                    <div key={index} className="rounded-lg overflow-hidden transform transition duration-700 ease-in-out hover:scale-105 hover:shadow-lg">
                        <img src={category.imageUrl} alt={category.name} className="w-full h-48 object-cover transition duration-700 ease-in-out hover:scale-110" />
                        <div className="px-8 bg-white/90 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-center border-l border-r border-b py-2">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DesignFifteen;
