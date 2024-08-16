// createBucket.js

import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

const supabase = supabase;

export async function handler(req) {
  const { userId } = req.query;
  const bucketName = `user-${userId}`;

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error listing buckets' }),
      };
    }

    if (!buckets.some(bucket => bucket.name === bucketName)) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, { public: true });

      if (createError) {
        console.error("Error creating bucket:", createError.message);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error creating bucket' }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Bucket ready' }),
    };
  } catch (error) {
    console.error("Error handling request:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
