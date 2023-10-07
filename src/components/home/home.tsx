import React from 'react';
import {Carousel, Image} from 'antd';

const contentStyle: React.CSSProperties = {
  maxHeight:'80vh',
  width:'80vw',
  borderRadius:20
};

const Home: React.FC = () => (
  <Carousel style={{width:'80vw', margin:"auto"}} autoplay effect="fade">
    <div>
      <Image
          style={contentStyle}
            src={require('./1.png')}
            preview={false}
          />
    </div>
    <div>
      <Image
            style={contentStyle}
            src={require('./2.png')}
            preview={false}
          />
    </div>
    <div>
      <Image
            style={contentStyle}
            src={require('./3.png')}
            preview={false}
          />
    </div>
  </Carousel>
);

export default Home;