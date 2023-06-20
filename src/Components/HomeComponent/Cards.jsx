import React, { useEffect, useState } from 'react';
import { database, onValue, ref } from '../../firebaseConfig'; // Replace with the correct path to your firebaseConfig file
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Counter from './Counter';
import {get} from 'firebase/database';
const WidgetCard = ({ title, description, stats, icon, link }) => {
    return (
      <Grid item xs={12} sm={8} md={8} lg={4} xl={4}>
        <Link href={link} underline="none">
          <Card style={{ backgroundColor: ' #0ba360 ' }}>
            <CardContent>
              <div>{icon}</div>
              <div>
                <Typography variant="h6" style={{ color: '#fff', marginBottom: '8px' }}>
                  {title}
                </Typography>
                <Typography variant="subtitle1" style={{ color: '#FFD95A', marginBottom: '8px' ,fontSize:"16px"}}>
                  {description}
                </Typography>
                <Typography variant="h4" style={{ color: '#fff' }}>
                  <Counter value={stats} />
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    );
  };
  
export default function MyComponent() {
    const [data, setData] = useState({ activeStudentCount: 0, totalStudentCount: 0, totalTeacherCount: 0 });
    const fetchData = async () => {
        try {
          const studentsSnapshot = await get(ref(database, 'Students'));
          const instructorsSnapshot = await get(ref(database, 'Instructors'));
          // console.log('Students Snapshot:', studentsSnapshot.val());
          // console.log('Instructors Snapshot:', instructorsSnapshot.val());
          const studentsData = studentsSnapshot.val();
          const instructorsData = instructorsSnapshot.val();
      
          const activeStudentCount = Object.values(studentsData || {}).reduce((count, student) => {
            if (student.status === 'Active') {
              count++;
            }
            return count;
          }, 0);
          const totalStudentCount = Object.keys(studentsData || {}).length;
          const totalTeacherCount = Object.keys(instructorsData || {}).length;
          // console.log('Active Student Count:', activeStudentCount);
          // console.log('Total Student Count:', totalStudentCount);
          // console.log('Total Teacher Count:', totalTeacherCount);
      
          setData({ activeStudentCount, totalStudentCount, totalTeacherCount });
        } catch (error) {
          // console.error('Error fetching data from Firebase:', error);
          setData({ activeStudentCount: 0, totalStudentCount: 0, totalTeacherCount: 0 });
        }
      };
      
  
    useEffect(() => {
      fetchData();
    }, []);
  
    useEffect(() => {
      const studentsRef = ref(database, 'Students');
      const instructorsRef = ref(database, 'Instructors');
  
      const studentsListener = onValue(studentsRef, () => {
        fetchData();
      });
  
      const instructorsListener = onValue(instructorsRef, () => {
        fetchData();
      });
  
      return () => {
        // Clean up the listeners when the component unmounts
        studentsListener();
        instructorsListener();
      };
    }, []);
  
  return (
    <div>
      <Grid container spacing={3}>
        <WidgetCard
          title="Online"
          description="Number of Active Students"
          stats={data.activeStudentCount}
          icon={<i className="ti-help" />}
          link="../Facts of case/admin/Facts of the Case.html"
        />
        <WidgetCard
          title="Manage Teachers"
          description="Number of Available Teachers"
          stats={data.totalTeacherCount}
          icon={<i className="ti-harddrives" />}
          link="../Parts of Polygraph/admin/Parts of the Polygraph.html"
        />
        <WidgetCard
          title="Manage Students"
          description="Total number of Students"
          stats={data.totalStudentCount}
          icon={<i className="ti-user" />}
          link="../../Dashboard Instructors/Manage Students/admin/Manage Students.html"
        />
      </Grid>
    </div>
  );
}
