# Welcome To AdGen 

This is a platform To Gnereate Direct Ad campaigns For any product currently listed on amazon some examples people can try :


    https://www.amazon.com/dp/0307887898
    https://www.amazon.com/dp/B077JBQZPX

## Tech Stack Includes:

    Nextjs ( Frontend)
    Nodejs ( Backend Mainly For Video Genaration Using Remotion)

## How The Architecture of version 1 Looks Like:

 ### The Script Genration Part And Scraping

1 . User Enters A Url For the Product on Amazon 
<br/>

2 . It is sent to The api route scrape-product thorugh pupperter the scraping of images details pricing is done 
<br/>

3. In the same api route we also have our ai integrated i am using openai for script generation , This api route returns main parts of the data correctly handled on both sides frontend and backend with correct Typescript interfaces and is showcased on the frontend

 ### Then Comes Main Part ( quite difficult as well ) Video Generation :

 1. We get the script and the product data and these things goes to our nodejs backend the whole logic is present in the server.ts file route generate-video .
 2. We also have routes showing the rendering process as well showing how many frames are already rendered 
 3. The Remotion Part is present under remotion folder in the root directory of backend this is the folder where logic of how the video would look like is written in react

 ## Thought Process:

 Initially I was going to write the whole code frontend as well as backend in the nextjs app router and I did too But There were some issues::

 First Why Fully Nextjs Because I am quite comfortable with it and also remotion was in react so it made a total sense to do so 

 Problem ? ---->> But When i tried Rendering Videos I caught up i nbundler errors related to Remotion then I thought of Maybe trying the similar thing with a nodejs backend whcih made things much easier ( Did Not Use ffmpeg Because The Docs OF Remotion Felt more easier and readable as  I was working with both of these for the first time it made sense)

 ## Help Of AI:

 It would Have been quite difficult For Me with using AI , as grasping what remotion is and how to use it would have been next to impossible. So areas where I used it are:

 Remotion React Components And Integrating with Express ( Nodejs )
 And Refining the code 
 The Part Of creating script with openai was quite familiar to me as i have worked with it earlier as well and build project aorund ai .

 ## How To Run Everything::

 1. Clone The Repo

 ### Setting up The Frontend:

    cd Frontend/

    npm i

    npm run dev

### Setting up Backend:

    In another Terminal 
    
    cd Backend

    npm i 

    npm run dev

    Enter Url in frontend You are Good To Go 