const axios = require('axios');

const SERVER_URL = 'http://localhost:3001';

async function testServer() {
  console.log('🧪 Testing Video Generation Server...\n');

  try {
    // 1. Test health endpoint
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${SERVER_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    console.log(`   Uptime: ${Math.round(healthResponse.data.uptime)}s\n`);

    // 2. Start test video generation
    console.log('2️⃣ Starting test video generation...');
    const testResponse = await axios.post(`${SERVER_URL}/test-video`);
    console.log('✅ Test video job created:', testResponse.data.jobId);
    console.log('📋 Sample data:', testResponse.data.sampleData);
    
    const jobId = testResponse.data.jobId;
    console.log(`\n3️⃣ Monitoring job ${jobId}...`);

    // 3. Poll status until completion
    let completed = false;
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes max

    while (!completed && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      try {
        const statusResponse = await axios.get(`${SERVER_URL}/video-status/${jobId}`);
        const status = statusResponse.data;
        
        attempts++;
        console.log(`   [${attempts}] Status: ${status.status.toUpperCase()}`);
        
        if (status.status === 'completed') {
          console.log('🎉 Video generation completed!');
          console.log('📹 Video URL:', status.videoUrl);
          console.log('💡 Open this URL in your browser to view the video!');
          completed = true;
        } else if (status.status === 'failed') {
          console.log('❌ Video generation failed:', status.error);
          completed = true;
        }
      } catch (pollError) {
        console.log(`   [${attempts}] Error checking status:`, pollError.message);
      }
    }

    if (!completed) {
      console.log('⏰ Test timed out after 2 minutes');
    }

    // 4. List all jobs
    console.log('\n4️⃣ Listing all jobs...');
    const jobsResponse = await axios.get(`${SERVER_URL}/jobs`);
    console.log(`📊 Total jobs: ${jobsResponse.data.totalJobs}`);
    jobsResponse.data.jobs.forEach((job, index) => {
      console.log(`   ${index + 1}. ${job.id} - ${job.status} - ${job.productTitle}`);
    });

    console.log('\n✅ Test completed successfully!');

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server not running! Please start the server first:');
      console.log('   npm run dev');
    } else {
      console.log('❌ Test failed:', error.message);
      if (error.response?.data) {
        console.log('   Server response:', error.response.data);
      }
    }
  }
}

// Run the test
testServer();