import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import MoreMenu from '../../MoreMenu'

describe('<MoreMenu/>', () => {
  it('should call the onClickDelete function when the delete button is clicked', () => {
    const onClickDelete = jest.fn()
    render(<MoreMenu onClickDelete={onClickDelete} />)

    fireEvent.click(screen.getByTestId('MoreHorizIcon'))
    fireEvent.click(screen.getByText('Delete'))

    expect(onClickDelete).toHaveBeenCalledTimes(1)
  })
})
