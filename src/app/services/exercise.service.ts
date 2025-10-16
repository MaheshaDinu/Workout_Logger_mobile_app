import { supabase } from '@/app/services/superbasse'; // Assuming this is the correct path and client
import { Exercise } from '@/app/constants/types';

/**
 * Fetches all exercises from the Supabase database.
 */
export const fetchAllExercises = async (): Promise<Exercise[]> => {
  try {
    console.log('📋 Fetching all exercises from Supabase...');
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ Error fetching exercises:', error);
      return [];
    }
    
    console.log('✅ Fetched exercises:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('❌ Unexpected error in fetchAllExercises:', error);
    return [];
  }
};

/**
 * Adds a new exercise to the database.
 * @param exercise The exercise data to add.
 */
export const addExercise = async (exercise: Omit<Exercise, 'id' | 'created_at'>): Promise<Exercise | null> => {
  try {
    console.log('Adding new exercise...');
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercise)
      .select()
      .single();

    if (error) {
      console.error('❌ Error adding exercise:', error);
      return null;
    }

    console.log('✅ Exercise added:', data);
    return data;
  } catch (error) {
    console.error('❌ Unexpected error in addExercise:', error);
    return null;
  }
};

/**
 * Updates an existing exercise in the database.
 * @param id The ID of the exercise to update.
 * @param updates The fields to update.
 */
export const updateExercise = async (id: string, updates: Partial<Exercise>): Promise<Exercise | null> => {
  try {
    console.log(`Updating exercise with ID: ${id}...`);
    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating exercise:', error);
      return null;
    }

    console.log('✅ Exercise updated:', data);
    return data;
  } catch (error) {
    console.error('❌ Unexpected error in updateExercise:', error);
    return null;
  }
};

/**
 * Deletes an exercise from the database.
 * @param id The ID of the exercise to delete.
 */
export const deleteExercise = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting exercise with ID: ${id}...`);
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting exercise:', error);
      return false;
    }

    console.log('✅ Exercise deleted successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unexpected error in deleteExercise:', error);
    return false;
  }
};
