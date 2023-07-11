'use client';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '@/app/components/Layout';
import { getError } from '@/utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
export default function AdminLockerEditScreen({ params }) {
  const lockerId = params.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ shouldUnregister: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/lockers/${lockerId}`);
        const { locker } = data;
        console.log(locker);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', locker.name);
        setValue('slug', locker.slug);
        setValue('price', locker.price);
        setValue('image', locker.image);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [lockerId, setValue]);

  const router = useRouter();

  const submitHandler = async ({ name, slug, price, image }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/admin/lockers/${lockerId}`, {
        name,
        slug,
        price,
        image,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Locker updated successfully');
      router.push('/admin/lockers');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Locker ${lockerId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/lockers" className="font-bold">
                Lockers
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Locker ${lockerId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register('name', {
                    required: 'Please enter name',
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register('slug', {
                    required: 'Please enter slug',
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register('price', {
                    required: 'Please enter price',
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image">image</label>
                <input
                  type="text"
                  className="w-full"
                  id="image"
                  {...register('image', {
                    required: 'Please enter image',
                  })}
                />
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
              </div>

              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? 'Loading' : 'Update'}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/lockers`}>Back</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminLockerEditScreen.auth = { adminOnly: true };
