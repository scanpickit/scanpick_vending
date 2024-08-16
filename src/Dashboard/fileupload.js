// fileupload.js
import { supabase } from '../Supabase/supabaseClient';

export const uploadFile = async (file) => {
    if (!file) {
        throw new Error("No file selected for upload");
    }

    try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `images/${fileName}`;

        // Upload the file
        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        // Get the public URL
        const { data: urlData, error: urlError } = await supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        if (urlError) {
            throw urlError;
        }

        return urlData.publicUrl;
    } catch (error) {
        console.error("Error uploading file:", error.message);
        throw error;
    }
};
