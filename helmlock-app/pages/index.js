import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import db from '../utils/db';
import Locker from '../models/Locker'
import Head from 'next/head';

export default function Home(props) {
  const {lockers} = props;
  return (
    
    <Layout>
      <Head>
        <title>Helmlock - Locker Dashboard</title>
      </Head>
      <div>
        <h1>Locker Dashboard</h1>
        <Grid container spacing={3}>
          {lockers.map((locker) => (
            <Grid item md={4} key={locker.name}>
              <Card>
                <NextLink href={`/locker/${locker.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={locker.image}
                      title={locker.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{locker.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>{locker.status}</Typography>
                  <Button size="small" color="primary">
                    Rent
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const lockers = await Locker.find({}).lean();
  await db.disconnect();
  return {
    props: {
      lockers: lockers.map(db.convertDocToObj),
    },
  };
}