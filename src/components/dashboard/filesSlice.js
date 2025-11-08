import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllFiles, uploadFile as apiUploadFile, deleteFile as apiDeleteFile } from '../../api/file';

// Helpers to normalize API differences
const parseFiles = (filesData) => {
  const list = filesData?.files || filesData?.data || filesData || [];
  return Array.isArray(list) ? list : [];
};

export const fetchFiles = createAsyncThunk('files/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await getAllFiles();
    return parseFiles(data);
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to fetch files');
  }
});

export const uploadFileThunk = createAsyncThunk('files/upload', async (file, { rejectWithValue }) => {
  try {
    const res = await apiUploadFile(file);
    return res; // backend may return the file; we just pass it through
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to upload file');
  }
});

export const deleteFileThunk = createAsyncThunk('files/delete', async (id, { rejectWithValue }) => {
  try {
    await apiDeleteFile(id);
    return id;
  } catch (err) {
    return rejectWithValue(err?.message || 'Failed to delete file');
  }
});

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    items: [],
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch files';
        state.items = [];
      })
      .addCase(uploadFileThunk.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadFileThunk.fulfilled, (state, action) => {
        state.uploading = false;
        // If API returns a file, push; otherwise caller can refetch
        const f = action.payload;
        if (f && typeof f === 'object') {
          // Keep newest first
          state.items = [f, ...state.items];
        }
      })
      .addCase(uploadFileThunk.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload || 'Failed to upload file';
      })
      .addCase(deleteFileThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((f) => (f?._id || f?.id || f?.s3FileId || f?.key || f?.uid) !== id);
      });
  },
});

export default filesSlice.reducer;
