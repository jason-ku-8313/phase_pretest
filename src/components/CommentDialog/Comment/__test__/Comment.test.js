import React from 'react'
import { screen, render } from '@testing-library/react'
import Comment from '../../Comment'

describe('<Comment/>', () => {
  it('should render the username, message and createAt', () => {
    const username = 'John Doe'
    const message = 'This is a test message'
    const createAt = '2022-01-01'
    render(
      <Comment username={username} message={message} createAt={createAt} />
    )

    expect(screen.getByText(username)).toBeInTheDocument()
    expect(screen.getByText(message)).toBeInTheDocument()
    expect(screen.getByText(createAt)).toBeInTheDocument()
  })
})