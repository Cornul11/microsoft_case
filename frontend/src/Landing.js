import {Alert} from "antd";

function Landing() {
    return <div>
        <Alert
            message="helDecoder"
            description="Medical texts are now easy to understand! Choose one of the sections in the menu to get started."
            type="success"
            showIcon
            style={{marginBottom: "8px"}}
        />
        <img alt="doctors" style={{
            width: "auto", height: "auto", maxWidth: '700px', margin: "10px auto 20px", display: "block", objectFit: "cover"
        }} src="https://miro.medium.com/max/2272/1*PiYUtOLC4A3RPjJp1Wv88w.jpeg"/>
    </div>;
}

export default Landing;
