import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import Welcome from '../../Welcome';
import { UserContext } from '../../../context/UserContext';

describe('<Welcome/>', () => {
  const setUser = jest.fn();
  
  it('should open the dialog by default', () => {
    render(
      <UserContext.Provider value={{ user: {}, setUser }}>
        <Welcome />
      </UserContext.Provider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should not close the dialog when backdrop is clicked', () => {
    render(
      <UserContext.Provider value={{ user: {}, setUser }}>
        <Welcome />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByTestId('sentinelStart'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should close the dialog when the Enter button is clicked', async () => {
    render(
      <UserContext.Provider value={{ user: {}, setUser }}>
        <Welcome />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('User Name'), { target: { value: 'jason' } });
    fireEvent.click(screen.getByText('Enter'));

    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'), { timeout: 200 });
  });

  it('should not close the dialog and set user name when username is empty', () => {
    render(
      <UserContext.Provider value={{ user: {}, setUser }}>
        <Welcome />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByText('Enter'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(setUser).not.toHaveBeenCalled();
  });

  it('should set user name when Enter button is clicked', () => {
    render(
      <UserContext.Provider value={{ user: {}, setUser }}>
        <Welcome />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('User Name'), { target: { value: 'jason' } });
    fireEvent.click(screen.getByText('Enter'));

    expect(setUser).toHaveBeenCalledWith({ username: 'jason' });
  });

  it('should set user name when pressing enter', () => {
    render(
      <UserContext.Provider value={{ user: {}, setUser }}>
        <Welcome />
      </UserContext.Provider>
    )

    const input = screen.getByLabelText('User Name')
    fireEvent.change(input, { target: { value: 'jason' } })
    fireEvent.keyDown(input, { keyCode: 13 })

    expect(setUser).toHaveBeenCalledWith({ username: 'jason' });
  })
});
