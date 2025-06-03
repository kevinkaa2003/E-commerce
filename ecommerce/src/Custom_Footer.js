import './Custom_Footer.css';
import { useNavigate } from 'react-router-dom';
import companyLogo from './companylogotemplate.jpg';



//Custom Footer Component
const CustomFooter = () => {
    const navigate = useNavigate();
    const goToContact = () => navigate('/Contact');

    return (
        <>
        <div className="mainfooter">
            <div className='footerwrapper'>
                <div className='footerlogo'><img src={companyLogo}/></div>
                <div className="footercontact">
                    <button className="footercontactbtn" onClick={goToContact}><strong>CONTACT</strong>
                    </button>
                    <div className="footercontactinfo">
                        <br/>
                        <strong>Phone:</strong> +X (XXX)-XXX-XXXX
                        <br/>
                        <br/>
                        <strong>E-mail:</strong> PLACEHOLDER
                        <br/>
                        <br/>
                        <strong>Address:</strong> PLACEHOLDER
                        <br/>
                        <br/>
                        <br/>
                        <div className="footersocialmedia">
                            <a href="#" className="facebookfooter">Facebook</a>
                            <br/>
                            <br/>
                            <a href="#" className="twitterfooter">Twitter</a>
                            <br/>
                            <br/>
                            <a href="#" className="instagramfooter">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className='map'>
                    <label for='officelocation' className='officelocationlabel'>OFFICE LOCATION</label>
                    <iframe id='officelocation' loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5533.85093474638!2d-95.3631815!3d29.7565073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c07770f8dc0d%3A0x43acc4dba64784d5!2sConsulate%20General%20of%20Japan%20in%20Houston!5e1!3m2!1sen!2sus!4v1743221618843!5m2!1sen!2sus"></iframe>
                </div>
            </div>
        </div>
        </>
      );
}

export default CustomFooter;
