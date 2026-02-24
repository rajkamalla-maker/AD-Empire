// Initialize 2 posts per category
const INITIAL_POSTS = [
    // 1. Cars & Bikes
    { _id: 'p1', title: '2020 Hyundai i20 Sportz', description: 'Mint condition, single owner, 25k driven. Service history available.', price: 650000, category: 'vehicles', subCategory: 'Car', cityName: 'Mumbai', state: 'Maharashtra', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Rahul', phone: '9876543210' },
    { _id: 'p2', title: 'Royal Enfield Classic 350', description: '2021 model, well-maintained, mostly used for weekend rides.', price: 180000, category: 'vehicles', subCategory: 'Bike', cityName: 'Bengaluru', state: 'Karnataka', createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Vikram', phone: '9876543211' },

    // 2. Mobiles & Electronics
    { _id: 'p3', title: 'iPhone 14 Pro 128GB', description: 'Scratchless condition, with box and original charger. 90% Battery health.', price: 75000, category: 'mobiles', subCategory: 'Mobile', cityName: 'Delhi', state: 'Delhi', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Neha', phone: '9876543212' },
    { _id: 'p4', title: 'Sony Bravia 55 inch 4K TV', description: 'Under warranty, selling due to relocation.', price: 42000, category: 'mobiles', subCategory: 'TV', cityName: 'Chennai', state: 'Tamil Nadu', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Karthik', phone: '9876543213' },

    // 3. Real Estate
    { _id: 'p5', title: 'Fully Furnished 2BHK Flat', description: 'Prime location, pool facing. Society has gym and security.', price: 8500000, category: 'real-estate', subCategory: 'Flat for Sale', cityName: 'Pune', state: 'Maharashtra', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Amit', phone: '9876543214' },
    { _id: 'p6', title: 'Commercial Office Space 1000sqft', description: 'Ready to move in, complete IT setup.', price: 50000, category: 'real-estate', subCategory: 'Office', cityName: 'Hyderabad', state: 'Telangana', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Sanjay', phone: '9876543215' },

    // 4. Jobs
    { _id: 'p7', title: 'Senior React Developer Wanted', description: 'Looking for a dev with 5+ years experience. Hybrid role.', price: 2000000, category: 'jobs', subCategory: 'Full-time', cityName: 'Bengaluru', state: 'Karnataka', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'TechCorp', phone: '9876543216' },
    { _id: 'p8', title: 'Part-time Content Writer', description: 'Freelance remote work for tech blog.', price: 15000, category: 'jobs', subCategory: 'Freelance', cityName: 'Remote', state: 'India', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), images: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Startup Inc', phone: '9876543217' },

    // 5. Furniture & Home
    { _id: 'p9', title: 'L-Shaped Sofa Set (6 seater)', description: 'Premium fabric, dark grey. Bought last year.', price: 22000, category: 'furniture', subCategory: 'Sofa', cityName: 'Delhi', state: 'Delhi', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Pooja', phone: '9876543218' },
    { _id: 'p10', title: 'Solid Wood Dining Table Set', description: '6 Seater teak wood table with chairs.', price: 18500, category: 'furniture', subCategory: 'Table', cityName: 'Mumbai', state: 'Maharashtra', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), images: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Rohan', phone: '9876543219' },

    // 6. Fashion & Clothing
    { _id: 'p11', title: 'Men\'s Leather Jacket - Zara', description: 'Size M, Black color, never worn.', price: 3500, category: 'fashion', subCategory: 'Men\'s', cityName: 'Pune', state: 'Maharashtra', createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Arjun', phone: '9876543220' },
    { _id: 'p12', title: 'Designer Lehenga (Pink)', description: 'Worn once for a wedding. Original price 25k.', price: 12000, category: 'fashion', subCategory: 'Women\'s', cityName: 'Jaipur', state: 'Rajasthan', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Priyanka', phone: '9876543221' },

    // 7. Services
    { _id: 'p13', title: 'Professional Home Cleaning', description: 'Deep cleaning with modern equipment.', price: 1999, category: 'services', subCategory: 'Cleaning', cityName: 'Chennai', state: 'Tamil Nadu', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'CleanPro Solutions', phone: '9876543222' },
    { _id: 'p14', title: 'Event Photography Services', description: 'Candid and traditional photo/video for weddings.', price: 15000, category: 'services', subCategory: 'Event Management', cityName: 'Kolkata', state: 'West Bengal', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Capture Moments', phone: '9876543223' },

    // 8. Pets & Animals
    { _id: 'p15', title: 'Golden Retriever Puppies', description: 'KCI registered, vaccinated, 45 days old.', price: 20000, category: 'pets', subCategory: 'Dog', cityName: 'Bengaluru', state: 'Karnataka', createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(), images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Raj', phone: '9876543224' },
    { _id: 'p16', title: 'Persian Kitten Flat Face', description: 'White female kitten, litter trained.', price: 12000, category: 'pets', subCategory: 'Cat', cityName: 'Mumbai', state: 'Maharashtra', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(), images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Sneha', phone: '9876543225' },

    // 9. Sports & Hobbies
    { _id: 'p17', title: 'Treadmill - FitMax 5000', description: 'Hardly used, max user weight 120kg.', price: 15000, category: 'sports', subCategory: 'Gym Equipment', cityName: 'Gurugram', state: 'Haryana', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Vineet', phone: '9876543226' },
    { _id: 'p18', title: 'Acoustic Guitar Yamaha F310', description: 'Beginner guitar, includes bag and picks.', price: 6500, category: 'sports', subCategory: 'Musical Instruments', cityName: 'Pune', state: 'Maharashtra', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), images: ['https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Anand', phone: '9876543227' },

    // 10. Education
    { _id: 'p19', title: 'JEE Advanced Preparation Books', description: 'Complete FIITJEE material + HC Verma.', price: 2500, category: 'education', subCategory: 'Books', cityName: 'Hyderabad', state: 'Telangana', createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Ravi', phone: '9876543228' },
    { _id: 'p20', title: 'Spoken English Online Classes', description: '1-to-1 interactive sessions for professionals.', price: 3000, category: 'education', subCategory: 'Courses', cityName: 'Remote', state: 'India', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(), images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Global Tutors', phone: '9876543229' },

    // 11. Other
    { _id: 'p21', title: 'Antique Brass Items', description: 'Vintage decor items dating back to 1950s.', price: 8000, category: 'other', subCategory: 'Miscellaneous', cityName: 'Jaipur', state: 'Rajasthan', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(), images: ['https://images.unsplash.com/photo-1581428982868-e410dd1401f3?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Bhawani', phone: '9876543230' },
    { _id: 'p22', title: 'Used Packing Boxes', description: 'Bundle of 50 heavy duty cardboard boxes.', price: 500, category: 'other', subCategory: 'Miscellaneous', cityName: 'Chennai', state: 'Tamil Nadu', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(), images: ['https://images.unsplash.com/photo-1603525547617-695078512dd5?w=500&auto=format&fit=crop&q=60'], status: 'approved', sellerName: 'Gopinath', phone: '9876543231' }
];

export const getPosts = () => {
    const cached = localStorage.getItem('marketplace_demo_posts');
    if (cached) {
        try { return JSON.parse(cached); } catch { }
    }
    localStorage.setItem('marketplace_demo_posts', JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
};

export const savePosts = (posts) => {
    localStorage.setItem('marketplace_demo_posts', JSON.stringify(posts));
};

export const updatePostStatus = (id, status) => {
    const posts = getPosts();
    const updated = posts.map(p => p._id === id ? { ...p, status } : p);
    savePosts(updated);
    return updated;
};

export const addPost = (post) => {
    const posts = getPosts();
    posts.unshift({
        ...post,
        _id: post._id || 'post_' + Date.now(),
        createdAt: post.createdAt || new Date().toISOString(),
        status: post.status || 'pending' // Admin can override status
    });
    savePosts(posts);
    return posts;
};

// Returns stats for the admin dashboard
export const getPostStats = () => {
    const posts = getPosts();
    return {
        total: posts.length,
        active: posts.filter(p => p.status === 'approved').length,
        pending: posts.filter(p => p.status === 'pending').length,
        rejected: posts.filter(p => p.status === 'rejected').length
    };
};
