import React from 'react';
import { render, fireEvent, screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import CommentDialog from '../../CommentDialog';
import PubSub from 'pubsub-js';
import { UserContext } from '../../../context/UserContext';
import { CREATE_MARKER, OPEN_COMMENT_DIALOG, REMOVE_MARKER } from '../../../constants/topic';

describe('<CommentDialog/>', () => {
    const mockUser = {
        username: 'User',
    };

    beforeEach(() => {
        jest.restoreAllMocks();
    })

    afterAll(() => {
        jest.clearAllMocks();
    })

    it(`should subscribe '${OPEN_COMMENT_DIALOG}' pubsub event when component mounted`, () => {
        jest.spyOn(PubSub, 'subscribe');
        render(<CommentDialog />);

        expect(PubSub.subscribe).toHaveBeenCalledWith(
            OPEN_COMMENT_DIALOG,
            expect.any(Function)
        );
    });

    it(`should unsubscribe '${OPEN_COMMENT_DIALOG}' pubsub event when component unmount`, () => {
        jest.spyOn(PubSub, 'unsubscribe');
        const { unmount } = render(<CommentDialog />);
        unmount();

        expect(PubSub.unsubscribe).toHaveBeenCalled();
    });

    it(`should open dialog when receive '${OPEN_COMMENT_DIALOG}' pubsub event`, () => {
        render(<CommentDialog />);
        act(() => {
            PubSub.publishSync(OPEN_COMMENT_DIALOG, { comments: [] });
        })

        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it.skip('should close the comment dialog when clicking ouside of the modal', async () => {
        render(<CommentDialog />)
        act(() => {
            PubSub.publishSync(OPEN_COMMENT_DIALOG, { comments: [] });
        })

        fireEvent.click(global.window.document.body) // Not working. TODO: Need to find a way to close Moadl
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'), { timeout: 200 });
    });

    it('should send the message when pressed Enter', async () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <CommentDialog />
            </UserContext.Provider>
        )
        act(() => {
            PubSub.publishSync(OPEN_COMMENT_DIALOG, { comments: [] });
        })

        const input = screen.getByPlaceholderText(/Add a comment./);
        fireEvent.change(input, { target: { value: 'Test comment' } });
        fireEvent.keyDown(input, { keyCode: 13 })

        expect(screen.getByText('User')).toBeInTheDocument()
        expect(screen.getByText('Test comment')).toBeInTheDocument()
        expect(screen.getByText('Resolve')).toBeInTheDocument();
        expect(input).toHaveAttribute('value', '');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display comments when received comments from pubsub event', async () => {
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <CommentDialog />
            </UserContext.Provider>
        )
        act(() => {
            PubSub.publishSync(OPEN_COMMENT_DIALOG, {
                comments: [{
                    createAt: "Sun, Feb 12, 24:00",
                    id: "1",
                    message: "comment 1",
                    username: "user1"
                },
                {
                    createAt: "Sun, Feb 12, 24:00",
                    id: "2",
                    message: "comment 2",
                    username: "user2"
                }]
            });
        })

        expect(screen.getByText('user1')).toBeInTheDocument()
        expect(screen.getByText('comment 1')).toBeInTheDocument()
        expect(screen.getByText('user2')).toBeInTheDocument()
        expect(screen.getByText('comment 2')).toBeInTheDocument();
    });

    it(`should publish a ${REMOVE_MARKER} event when clicked Resolve button`, async () => {
        jest.spyOn(PubSub, 'publish');
        const mockCommentMarker = {
            coordinate: [0, 0],
            name: "marker 1",
            parent: "bulldog",
            comments: [{
                createAt: "Sun, Feb 12, 24:00",
                id: "1",
                message: "comment 1",
                username: "user1"
            }]
        }
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <CommentDialog />
            </UserContext.Provider>
        )
        act(() => {
            PubSub.publishSync(OPEN_COMMENT_DIALOG, mockCommentMarker);
        })

        fireEvent.click(screen.getByText('Resolve'))
        expect(PubSub.publish).toHaveBeenCalledWith(
            REMOVE_MARKER,
            mockCommentMarker,
        )
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'), { timeout: 200 });
    });

    it.skip(`should publish a ${CREATE_MARKER} event when closing dialog`, async () => {
        jest.spyOn(PubSub, 'publish');
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <CommentDialog />
            </UserContext.Provider>
        )
        act(() => {
            PubSub.publishSync(OPEN_COMMENT_DIALOG, {
                coordinate: [0, 0],
                name: "marker 1",
                parent: "bulldog",
                comments: [{
                    createAt: "Sun, Feb 12, 24:00",
                    id: "1",
                    message: "comment 1",
                    username: "user1"
                }],
                shouldCreateSprite: true,
            });
        })

        // TODO: Need to find a way to close the modal
        expect(PubSub.publish).toHaveBeenCalledWith(
            CREATE_MARKER,
            {
                coordinate: [0, 0],
                name: "marker 1",
                parent: "bulldog",
                comments: [{
                    createAt: "Sun, Feb 12, 24:00",
                    id: "1",
                    message: "comment 1",
                    username: "user1"
                }]
            }
        )
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'), { timeout: 200 });
    });

    it.skip(`should not publish a ${CREATE_MARKER} event when closing an existing dialog`, async () => {
        jest.spyOn(PubSub, 'publish');
        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <CommentDialog />
            </UserContext.Provider>
        )
        act(() => {
            PubSub.publishSync(OPEN_COMMENT_DIALOG, {
                coordinate: [0, 0],
                name: "marker 1",
                parent: "bulldog",
                comments: [{
                    createAt: "Sun, Feb 12, 24:00",
                    id: "1",
                    message: "comment 1",
                    username: "user1"
                }],
                shouldCreateSprite: false,
            });
        })

        // TODO: Need to find a way to close the modal

        expect(PubSub.publish).not.toBeCalled()
        await waitForElementToBeRemoved(() => screen.queryByRole('dialog'), { timeout: 200 });
    });

})