import { AnyType } from '@/types/shared';
import { createSlice } from '@reduxjs/toolkit';
import { map } from 'lodash';
import axios from '../../../utils/axios';
import { AppDispatch } from '../../store';

const API_URL = '/api/data/postData';

interface StateType {
  posts: AnyType[];
  followers: {
    id: string;
    isFollowed: boolean;
  }[];
  gallery: AnyType[];
}

const initialState = {
  posts: [],
  followers: [],
  gallery: [],
};

export const UserProfileSlice = createSlice({
  name: 'UserPost',
  initialState,
  reducers: {
    getPosts: (state, action) => {
      state.posts = action.payload;
    },
    getFollowers: (state, action) => {
      state.followers = action.payload;
    },
    getPhotos: (state, action) => {
      state.gallery = action.payload;
    },
    onToggleFollow(state: StateType, action) {
      const followerId = action.payload;

      const handleToggle = map(state.followers, (follower) => {
        if (follower.id === followerId) {
          return {
            ...follower,
            isFollowed: !follower.isFollowed,
          };
        }

        return follower;
      });

      state.followers = handleToggle;
    },
  },
});

export const { getPosts, getFollowers, onToggleFollow, getPhotos } =
  UserProfileSlice.actions;

export const fetchPosts = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}`);
    dispatch(getPosts(response.data));
  } catch (err) {
    throw new Error(err as string);
  }
};
export const likePosts = (postId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post('/api/data/posts/like', { postId });
    dispatch(getPosts(response.data.posts));
  } catch (err) {
    throw new Error(err as string);
  }
};
export const addComment =
  (postId: number, comment: AnyType[]) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('/api/data/posts/comments/add', {
        postId,
        comment,
      });
      dispatch(getPosts(response.data.posts));
    } catch (err) {
      throw new Error(err as string);
    }
  };

export const addReply =
  (postId: number, commentId: AnyType[], reply: AnyType[]) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post('/api/data/posts/replies/add', {
        postId,
        commentId,
        reply,
      });
      dispatch(getPosts(response.data.posts));
    } catch (err) {
      throw new Error(err as string);
    }
  };

export const fetchFollwores = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/api/data/users`);
    dispatch(getFollowers(response.data));
  } catch (err) {
    throw new Error(err as string);
  }
};

export const fetchPhotos = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`/api/data/gallery`);
    dispatch(getPhotos(response.data));
  } catch (err) {
    throw new Error(err as string);
  }
};

export default UserProfileSlice.reducer;
