import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job';
import Applicant from '../models/Applicant';
import { dummyJobs } from './dummyJobs';
import { dummyProfiles } from './dummyProfiles';

dotenv.config();

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in the environment variables.');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB');

    // Clear existing collections
    console.log('Clearing existing jobs and applicants...');
    await Job.deleteMany({});
    await Applicant.deleteMany({});
    console.log('Collections cleared');

    // Insert Dummy Jobs
    console.log('Inserting dummy jobs...');
    const insertedJobs = await Job.insertMany(dummyJobs);
    console.log(`Successfully inserted ${insertedJobs.length} jobs`);

    // Insert Applicants for each job
    // According to requirements: 5 random applicants from the 15 profiles for each job
    for (const job of insertedJobs) {
      // Shuffle profiles and pick 5
      const shuffledProfiles = [...dummyProfiles].sort(() => 0.5 - Math.random());
      const selectedProfiles = shuffledProfiles.slice(0, 5);

      const applicantsToInsert = selectedProfiles.map(profile => ({
        jobId: job._id,
        profile: profile,
        source: 'platform' as 'platform' | 'upload'
      }));

      const insertedApplicants = await Applicant.insertMany(applicantsToInsert);
      console.log(`Successfully inserted ${insertedApplicants.length} applicants for job: ${job.title}`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    console.log('Closing database connection...');
    await mongoose.connection.close();
  }
};

seedDB();
