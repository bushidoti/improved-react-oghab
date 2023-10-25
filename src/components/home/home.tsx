import React from 'react';
import {Carousel} from 'antd';



const Home: React.FC = () => (
    <Carousel className='w-full' autoplay effect="fade">
            <img
                className='object-fill rounded h-[80vh]'
                src={require('./1.png')}
                alt=''
            />
            <img
                className='object-fill rounded h-[80vh]'
                src={require('./2.png')}
                alt=''
            />
            <img
                className='object-fill rounded h-[80vh]'
                src={require('./3.png')}
                alt=''
            />
    </Carousel>
);

export default Home;