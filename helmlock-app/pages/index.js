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
import data from '../utils/data';

export default function Home() {
  return (
    <Layout>
      <div>
        <h1>Lockers</h1>
        <Grid container spacing={3}>
          {data.lockers.map((locker) => (
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
