import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="containerAboutUs">
      <h1 className="headingAboutUs">Fast Frames: Enhancing Video Quality</h1>
      <p className="textAboutUs">
        In a world driven by the visual power of videos, the quality of what we see holds paramount importance. However, we've all encountered videos that, due to low frame rates, exhibit jarring motion and less-than-optimal viewing experiences. Fast Frames is the answer to this challenge. It's a groundbreaking project that harnesses the capabilities of deep learning to transform the way we perceive and enjoy video content. Our mission is clear: not only to enhance frame rates but to elevate the overall quality of videos, reduce motion judder, and minimize interpolation artifacts.
        <br /><br />
        Fast Frames is an innovative endeavor aimed at enhancing video quality by addressing the persistent challenge of low frame rates. The project focuses on leveraging Generative AI and advanced image-to-image translation models to generate interpolated frames within video sequences. By harnessing techniques based on the CAIN architecture, the model learns to autonomously interpolate frames, thus significantly improving frame rates and elevating the overall video viewing experience.
        <br /><br />
        Fast Frames eliminates the need for external optical flow models, allowing the network to discern motion patterns independently. The proposed architecture involves feature extraction, PixelShuffle, channel attention, feature fusion, and upsampling techniques to generate high-quality intermediate frames. The model undergoes end-to-end training, utilizing a combination of L1 and adversarial losses, outperforming existing methods on benchmark datasets for video frame interpolation.
      </p>
    </div>
  );
}

export default AboutUs;
