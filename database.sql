-- 1. WORKOUT DAYS TABLE (The top-level "Folder")
CREATE TABLE workout_days (
                              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                              user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
                              workout_date DATE NOT NULL,
                              day_index INT DEFAULT 0 NOT NULL,
                              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Ensures an account can't have duplicate identical index rows on the exact same calendar day
                              UNIQUE(user_id, workout_date, day_index)
);

-- 2. EXERCISES TABLE (The sub-category)
CREATE TABLE exercises (
                           id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                           workout_day_id UUID REFERENCES workout_days(id) ON DELETE CASCADE NOT NULL,
                           name TEXT NOT NULL,
                           order_index INT DEFAULT 0 NOT NULL,
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SETS TABLE (The metric breakdown sheet)
CREATE TABLE exercise_sets (
                               id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                               exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
                               set_number INT NOT NULL,
                               weight NUMERIC(6, 2) NOT NULL,       -- Supports precise decimals (e.g., 45.5 lbs/kg)
                               reps INT NOT NULL,
                               rest_time_seconds INT DEFAULT 0 NOT NULL,
                               created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- 5. CREATE SECURITY POLICIES (Users can only look at/edit their own data)
CREATE POLICY "Users can manage their own workout days"
  ON workout_days FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage exercises linked to their days"
  ON exercises FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM workout_days
    WHERE workout_days.id = exercises.workout_day_id AND workout_days.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage sets linked to their exercises"
  ON exercise_sets FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM exercises
    JOIN workout_days ON workout_days.id = exercises.workout_day_id
    WHERE exercises.id = exercise_sets.exercise_id AND workout_days.user_id = auth.uid()
  ));