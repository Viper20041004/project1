import React from 'react';
import { SlideComponent } from '../../components/SlideComponent/SlideComponent';
import { WrapperHomePage, WrapperSectionSchool, WrapperSlide, WrapperBody1, WrapperBody2, FeaturedContainer, FeaturedContent, FeaturedText, FeaturedDate, FeaturedImage, WrapperBody3, WrapperNumberBody3, WrapperTextBody3, WrapperBody5Left, WrapperBody5Image, WrapperBody5Text, WrapperBody5, WrapperBody4Title, WrapperBody4Text, WrapperBody4Image, WrapperBody4, WrapperBody4Right, WrapperBody4Left, WrapperBody6, WrapperBody6Title, WrapperBody6Text, WrapperBody6Card } from './styled';
import MenuComponent from '../../components/MenuComponent/MenuComponent';
import SectionSchoolComponent from '../../components/SectionSchoolComponent/SectionSchoolComponent';
import { Col, Row , Image} from 'antd';
import { SpaceCompactItemContext } from 'antd/es/space/Compact';
import backGround from '../../assets/images/logo/utc2.png'
import utc3 from '../../assets/images/logo/utc3.png'
import ChatComponent from '../../components/ChatComponent/ChatComponent';

const imagesSlide = import.meta.glob('../../assets/images/slide/*.{jpg,png}', { eager: true });
const slideImages = Object.values(imagesSlide).map((module) => module.default);

const imagesFeatured = import.meta.glob('../../assets/images/featured/*.{jpg,png}', { eager: true });
const featuredImages = Object.entries(imagesFeatured).map(([path, module]) => ({
  src: module.default,
  key: path.split('/').pop().split('.')[0],
}));
const featuredItems = [
    {key:'1',title:'tháng 10 25' , describe:'Đại hội Hội CCB Trường ĐHGTVT lần thứ V nhiệm kỳ 2025-2030', image: featuredImages[0].src},
    {key:'2',title:'tháng 10 16' , describe:'Sinh viên Trường Đại học GTVT tham quan thực tế tại Công ty Cổ phần thép Việt Ý', image: featuredImages[1].src},
    {key:'3',title:'tháng 10 18' , describe:'Nâng tầm hệ thống đảm bảo chất lượng - Nền tảng để Trường Đại học GTVT vươn tới Top 200 Châu Á năm', image: featuredImages[2].src},
    {key:'4',title:'tháng 10 15' , describe:'Ngày hội hướng nghiệp Career Day 2025', image: featuredImages[3].src},
]

const HomePage = () => {
  return(
  <>
    <WrapperHomePage>
      <WrapperBody1>
            <WrapperSlide>
                <SlideComponent
                arrImage={slideImages}
                />
            </WrapperSlide>
            <WrapperSectionSchool>
                <SectionSchoolComponent />
            </WrapperSectionSchool>
        </WrapperBody1>
        <WrapperBody2>
            <h1 className="title">Tin nổi bật</h1>
            <FeaturedContainer>
            {featuredItems.map((item,index) => {
                const parts = item.title.split(' ');
                const month = parts[0] + ' ' + parts[1];
                const day = parts[2];
                const isReversed = index % 2 == 1; 
                return ( 
                <FeaturedContent key={item.key} $reverse={isReversed}>
                    <FeaturedText>
                        <FeaturedDate>
                            <span className="month">{month}</span>
                            <span className="day">{day}</span>
                        </FeaturedDate>
                        <p>{item.describe}</p>
                        <p className="read-more">Đọc tiếp ➔</p>
                    </FeaturedText>
                    <FeaturedImage src={item.image} alt={item.title} preview={false} height={150} width={150} />
                </FeaturedContent>
                );
            })}
            </FeaturedContainer>
        </WrapperBody2>
        <WrapperBody3>
            <Col span={8} >
                <WrapperNumberBody3>6,000+</WrapperNumberBody3>
                <WrapperTextBody3>Người học </WrapperTextBody3>
            </Col>
            <Col span={8}>
                <WrapperNumberBody3>20+</WrapperNumberBody3>
                <WrapperTextBody3>Ngành đào tạo Đại học </WrapperTextBody3>
            </Col>
            <Col span={8}>
                <WrapperNumberBody3>27,000+</WrapperNumberBody3>
                <WrapperTextBody3>Sinh viên đã tốt nghiệp </WrapperTextBody3>
            </Col>
        </WrapperBody3>
        <WrapperBody4>
            <WrapperBody4Left span={12}>
                <WrapperBody4Title style={{ color: '#000' }}>Sứ mạng</WrapperBody4Title>
                <WrapperBody4Text style={{ color: '#fff' }}>
                Trường Đại học Giao thông vận tải có sứ mạng đào tạo, nghiên cứu khoa học, chuyển giao công nghệ chất lượng cao theo xu thế hội nhập, có trách nhiệm xã hội nhằm thúc đẩy sự phát triển bền vững của ngành giao thông vận tải và đất nước.
                </WrapperBody4Text>
            </WrapperBody4Left>

            <WrapperBody4Right span={12}>
                <WrapperBody4Image src={utc3} alt="utc3" preview={false} />
                <WrapperBody4Title style={{ color: '#fab101', marginTop: '40px' }}>Tầm nhìn</WrapperBody4Title>
                <WrapperBody4Text style={{ color: '#000' }}>
                Trở thành trường đại học đa ngành theo định hướng nghiên cứu, khẳng định vị thế hàng đầu Việt Nam trong lĩnh vực giao thông vận tải, có uy tín và chất lượng ngang tầm Châu Á.
                </WrapperBody4Text>
            </WrapperBody4Right>
        </WrapperBody4>
        <WrapperBody6>
            <WrapperBody6Card span={8}>
                <WrapperBody6Title>Sinh viên tương lai</WrapperBody6Title>
                <WrapperBody6Text>Trở thành sinh viên của Trường Đại học Giao thông vận tải, bạn có cơ hội tiếp cận môi trường học tập với cơ sở vật chất hiện đại, tiện nghi; chương trình đào tạo tiên tiến; môi trường rèn luyện năng động và sáng tạo.</WrapperBody6Text>
            </WrapperBody6Card>
            <WrapperBody6Card span={8}>
                <WrapperBody6Title>Sinh viên hiện tại</WrapperBody6Title>
                <WrapperBody6Text>Sinh viên Giao thông không chỉ tham gia những tiết học chính khóa bổ ích trên giảng đường, mà còn có cơ hội tham gia vào các câu lạc bộ học thuật để thỏa mãn đam mê học tập và nghiên cứu như: CLB Robocon, CLB lái xe sinh thái, CLB diễn thuyết, CLB tiếng Anh,</WrapperBody6Text>
            </WrapperBody6Card>
            <WrapperBody6Card span={8}>
                <WrapperBody6Title>Cựu sinh viên</WrapperBody6Title>
                <WrapperBody6Text>Với mục đích tri ân Nhà trường, các cựu sinh viên đã bày tỏ tầm lòng tri ân với Nhà trường qua các hoạt động như ủng hộ kinh phí xây dựng Nhà trường, tặng hoa tri ân các thầy giáo cô giáo. mong muốn Nhà trường ngày càng phát triển, sáng mãi thông điệp "Chúng tôi tự h</WrapperBody6Text>
            </WrapperBody6Card>
        </WrapperBody6>
        <WrapperBody5>
            <WrapperBody5Left >
                <WrapperBody5Text>
                    Trường Đại học Giao thông vận tải hướng tới đào tạo người học trở thành công dân toàn cầu, có tinh thần dân tộc và trách nhiệm quốc tế. 
                </WrapperBody5Text>
                <WrapperBody5Text>
                    Nhà trường áp dụng phương pháp giáo dục tích cực, học đi đôi với hành, kiến tạo môi trường giúp người học xây dựng và rèn luyện ý thức tự học suốt đời, khả năng thích ứng với mọi hoàn cảnh nhằm phát huy tốt nhất tiềm năng và khả năng sáng tạo. 
                </WrapperBody5Text>
                <WrapperBody5Text>
                    Nhà trường xác định người học là trung tâm, người thầy truyền cảm hứng.
                </WrapperBody5Text>
            </WrapperBody5Left>
            <WrapperBody5Image src={backGround} alt='backgroung' preview={false} style={{width:'70%'}} />
        </WrapperBody5>
        <ChatComponent />
    </WrapperHomePage>
    </>
  );
};


export default HomePage;
