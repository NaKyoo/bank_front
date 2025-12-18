import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
    it('should render without crashing', () => {
        render(<App />)
        expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument()
    })

    it('should display the counter button', () => {
        render(<App />)
        expect(screen.getByRole('button', { name: /count is/i })).toBeInTheDocument()
    })
})
