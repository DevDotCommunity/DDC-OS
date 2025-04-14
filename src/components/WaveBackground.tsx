
const WaveBackground = () => {
  return (
    <div className="wave-bg">
      {/* First wave */}
      <svg 
        className="wave-1" 
        width="100%" 
        height="100%"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920 1080"
      >
        <path
          fill="rgba(37, 99, 235, 0.05)"
          d="M0,128L80,154.7C160,181,320,235,480,245.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,1080L1360,1080C1280,1080,1120,1080,960,1080C800,1080,640,1080,480,1080C320,1080,160,1080,80,1080L0,1080Z"
        ></path>
      </svg>
      
      {/* Second wave */}
      <svg 
        className="wave-2" 
        width="100%" 
        height="100%"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1920 1080"
      >
        <path
          fill="rgba(79, 70, 229, 0.05)"
          d="M0,576L80,544C160,512,320,448,480,400C640,352,800,320,960,330.7C1120,341,1280,395,1360,421.3L1440,448L1440,1080L1360,1080C1280,1080,1120,1080,960,1080C800,1080,640,1080,480,1080C320,1080,160,1080,80,1080L0,1080Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveBackground;
