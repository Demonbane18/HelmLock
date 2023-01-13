import React, {useContext} from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Link,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import Locker from '../../models/Locker';
import db from '../../utils/db';
import axios from 'axios';
import  { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
export default function LockerScreen(props) {
  const router = useRouter();
  const {dispatch} = useContext(Store);
  const {locker} = props;
  const classes = useStyles();
  if (!locker) {
    return <div>Locker not Found!</div>;
  }
  const addToCarthandler = async () => {
    const {data} = await axios.get(`/api/lockers/${locker._id}`);
    if(data.status === 'occupied') {
      window.alert('Sorry, locker is already occupied!');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: {...locker, time_elapsed:5}})
    router.push('/cart');
  }
  return (
    <Layout title={locker.name}>
      <div>
        <NextLink href="/" passHref>
          <Link>
            <Typography>back to lockers</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={locker.image}
            alt={locker.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography variant="h4" component="h4">
                {locker.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>
                {locker.time_elapsed > 0 ? `Time elapsed: ${locker.time_elapsed}` : ''}
              </Typography>
            </ListItem>
          </List>
          <Grid item md={3} xs={12}>
            <Card sx={{ minWidth: 275 }} variant="outlined">
              <CardContent>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>${locker.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography sx={{ fontStyle: 'bold' }}>
                          Status
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{locker.status}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    {locker.status === 'vacant' ? (
                      <Button fullWidth variant="contained" color="primary" onClick={addToCarthandler}>
                        Rent
                      </Button>
                    ) : (
                      ''
                    )}
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const locker = await Locker.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      locker: db.convertDocToObj(locker),
    },
  };
}