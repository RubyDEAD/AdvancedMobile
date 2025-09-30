import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ThemeState = {
  mode: 'light' | 'dark'
  accentColor: string
}

const initialState: ThemeState = {
  mode: 'light',
  accentColor: '#3fc24e', // default green
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload
    },
  },
})

export const { toggleTheme, setAccentColor } = themeSlice.actions
export default themeSlice.reducer
