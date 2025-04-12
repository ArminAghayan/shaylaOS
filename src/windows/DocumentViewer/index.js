import React from "react";
import { useRecoilState } from "recoil";
import { windowObj } from "../../store";

import "./styles.scss";

// Simple content mapping for each document
const documentContents = {
  "3 months.doc": (
    <>
      <h2>3 Months</h2>
      <p>
      April 11th , 2025
      <p>
        <br/>
        Dear Jana,
        <br/>
      </p>
      <br/>

I’ve always sent to myself what I would want my person to look like, what are the personality traits that I want in my person, where does my person have to be from, what does my person have to like, and every time I thought about these things, they seemed so out of reach. This type of person that I’m looking for isn’t a real person, they can’t have all those things in one. But somehow by the blessing of god, I found that. Jana, you are everything I could ever ask for. From the way you laugh, to the jokes you tell me, to the hours of laughing, to the countless pictures of monkeys and chihuahuas, to the perfect face and sexy body, you are everything I could have ever asked for. I’m so happy I went out that day and met you, I really can’t think how my life would be right now if I never met you. If I didn’t think for hours on how I can get you to go on a date with me, if I didn’t spend a week planning our first date, if I didn’t overthink how I should pick you up from the airport, if I didn’t plan our first Valentine’s Day to be as amazing as it could be for you. All of these things I’m so grateful I did because it made me realize how much I love you. There has never been a point in my life where I could really sit there and say with my whole heart this girl is my everything, and for the first time ever I finally have that feeling with you. You make me whole. My Shayla, this is only the first 3 months of us dating but it feels like I’ve known you in a past life, and I really do believe we did. Even at 3 months there’s not a day where you don’t run my mind, there’s not a day I don’t daydream about you, every time my phone rings I look to see if it’s you, every time I get a text I look to see if it’s you, every TikTok, Instagram video I look to see if it’s you. But getting more into you now, I just want to say, you will be the best mother ever. I really, really mean this with everything I love: the way you talk about motherhood and what you would do differently from your parents and what you learn, how caring you are, how thoughtful you are, you will be the best mother I already know, and it’s one of the many things I love about you. I can’t wait for the day we have children and seeing you flourish at it. Adding to this point with how caring you are and thoughtful, this brings me into your career. My princess, you will without a doubt be the best teacher in the world, a teacher that is caring to the kids, and a teacher that every single kid wants to go see at school, a teacher that kids remember their whole life, a teacher that classes are happy and full. This is one thing I know, and I can’t wait to see you do so well at it. To go from this, I want you to be easier on yourself. There is no one I know that is doing as much as you, baby. You do so much, like so much. You think it’s nothing, but it really is. The routine you have, the motivation you have, no one in your classes has that. Please, baby, don’t be so hard on yourself about “how you’re not doing enough.” Baby, I get worried because I think sometimes you’re doing too much. Please be more gentle. Looking forward, I can’t wait to spend the rest of my life with you. It’s gonna be the best. I know it’s gonna be with you, and I can’t wait for it. This is only month 3, but it’s the start to something so beautiful, and I can’t wait to spend the next 100 with you. I love you, my Shayla. I pray for us to live together soon. I hope you love our day today. 
      <br/>
      <br/>

(p.s.) I wrote from my heart and didn’t edit any of it, so if I sound like I’m yapping, I am.
<br/>
<br/>

Love you more {'<'}3
<br/>
Armin Aghayan 
<br/>

      </p>
      {/* Add more resume details */}
    </>
  ),
  "poem.doc": (
    <>
      <h2>Poem</h2>
      <p>Dear Hiring Manager,</p>
      <p>I am writing to express my interest in the Software Engineer position...</p>
      {/* Add more cover letter text */}
    </>
  ),
  "My letter about me.doc": (
    <>
      <h2>My letter about me</h2>
      <p>March 12th ,2025
      </p>
      <p>
        <br/>
        To my lover, my future wife, my shayla,
        <br/>
      </p>
      <br/>
      <p>
      I want to start by writing this saying that I am so thankful to have you in my life. Thought these last few months being with you I've come to see you are my end game, you are my soulmate, you are my person, you are perfect for me. I sit and wonder every day how this has happened to me. Why did I get such an amazing woman to be part of my life? This past few months I've come to the realization this is not luck, this is not chance, this is simply one thing. This is the divine plan by god. I honestly wanted to give this to you earlier but I wanted to look for the right time to say it and if I'm giving this to you now I must be that time. From the moment that I met you I had a feeling in my heart that this might be the one that I call my wife, and I've never felt like that before, it made me think, what if. What if I did go out that night, what if I didn't see you, what if I didn't text you the next day. All things I wonder but I am so grateful that it went the way it did. I want to take the time to write about myself a little here because I feel like it's hard for me to talk about myself and how I feel because I don't want you to think of me in any other way but I believe this is the time to tell you. I am a Persian-Canadian born in Windsor, Ontario. Life growing up was great overall but I feel like I always lacked love from people in my life. In school I was never the most popular, or the coolest person that people wanted to be friends with. I had trouble making friends because I moved so much, because of my family trying to get their life started in Canada. My mom was never really home and neither was my dad. This went on for years until I moved to Toronto, more specifically King City. It was Grade 4, I was in a new school with new people. I felt like an outsider, I didn't really fit in. Everyone around me was Italian or white, I was one of the few kids that was of color. This didn't bother me at the time because I didn't understand race, but all the other kids played hockey, all knew each other, parents knew each other, played sports together. There I was the new kid that looked different. My whole wardroom was Gap and Tommy Hilfiger, typical Middle Eastern parents lol. So I was dressed very differently from the other kids. I had big puffy hair with a unibrow and a mustache and no one looked like me. From grade 4-6 these were some of the worst years of my life. I was bullied by everyone. I was made fun of for the way I dressed, the hair on my face. Things out of my control and I didn't know what to do. What made it worse was it wasn't just the guy it was the girls too. I remember there was a girl that made fun of my name and she made the whole class start calling me armpit, arminhammer, arminultrastrong. At the time this really bothered me, to the point where I hated myself and my parents for choosing a Middle Eastern name like that. I hate Armin so much I used to pray that god would get my parents to change my name. It got to the point where I didn't know what to do. One day I went to my dad and told him about the girl calling me names, hoping my dad would do something about it, but he just looked at me. He told me it's nothing. Looking back it was nothing but at the time as a kid, it hurt. To think my own family doesn't care about me getting bullied for my name. Fast forward grade 8 I was bullied for my unibrow but I was never told by my parents to do something about it so I never knew and one day I still shaved my dad's razor and got rid of my mustache and unibrow and my parents got mad. I was confused, and uncomfortable with my own body. But as time went on in high school I started to glow up and you know I'm the best looking guy now ofc. But I say this all to tell you that I was never loved as a kid, I never got love as a kid, and every past relationship, I was never loved. I was used for something, either money or attention. The love that I have for you is more than you could ever imagine because it's not just Armin the 22-year-old loving you, it's Armin the 10-year-old boy that was looking for love when no one would. I just want to say thank you for showing me what love is, and I always will try my best to make you happy and make sure our life is the best possible for not only us but for our son and daughter in the future. Making sure they get the love from us that I never got from my parents. I say all this to say this is not luck, this is not chance, this is simply one thing. This is the divine plan by god. The boy who was on his knees in his bathroom praying for love from god was blessed with it this year, and I'm so thankful that you're in my life. You have not only shown me love but also brought me closer to god. I can't thank you enough. I pray for you, I pray for your family, I pray for our future. You have shown me the path, and I can't thank you enough. I love talking about islam with you, and I can't wait to talk more about it for the rest of our life and get closer together to god. This is a lot and I rambled but I just wanted to tell you this and didn't know how another way. I love you.
      </p>
      <br/>
    </>
  ),
  "1 month.doc": (
    <>
      <h2>1 Month</h2>
      <p>
        Tuesday, February 10th, 2025
      </p>
      <p style={{ textAlign: 'center' }}>
Dear Jana,

I want to start this by saying I love you. 
<br/>
With every breath, my love grows anew.
<br/>
I hope you feel it, the way I do,
<br/>
A bond so pure, forever new.
<br/>
From your big brown eyes to your beautiful smile,
<br/>
I want to start this by saying I love you. 
<br/>
With every breath, my love grows anew.
<br/>
I hope you feel it, the way I do,
<br/>
A bond so pure, forever new.
<br/>
From your big brown eyes to your beautiful smile,
<br/>
You make my heart race miles and miles,
<br/>
From your big brown eyes to your pure soul,
<br/>
You make my hear feel so whole.
<br/>
On this day, I just want to say,
<br/>
Will you be my valentine and make my day?
<br/>
<br/>
<br/>

      </p>
      <p>
xoxo, Love you
<br/>
Armin Aghayan
      </p>
      {/* Add more budget details */}
    </>
  ),
};

export default function DocumentViewer() {
  const [currentWindows] = useRecoilState(windowObj);
  const viewerState = currentWindows.documentViewer;
  const document = viewerState?.currentDocument;

  // Get the specific content for the current document name
  const content = document ? documentContents[document.name] : null;

  return (
    <section className="documentViewerWindow">
      <div className="scrollable -yOnly documentViewerWindow__body">
        <div className="documentViewerWindow__bodyInner">
          {document ? (
            <>
              {/* Display the specific content or a default message */}
              {content || <p>Content for {document.name} is not defined yet.</p>}
            </>
          ) : (
            <p>No document selected.</p>
          )}
        </div>
      </div>
    </section>
  );
} 