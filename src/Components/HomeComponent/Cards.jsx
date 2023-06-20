import React, { useEffect, useState } from 'react';
import { database, onValue, ref } from '../../firebaseConfig'; // Replace with the correct path to your firebaseConfig file
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Counter from './Counter';
import { get } from 'firebase/database';

const WidgetCard = ({ title, description, stats, icon, link, onClick }) => {
  return (
    <Grid item xs={12} sm={8} md={8} lg={4} xl={4}>
      <Link href={link} underline="none">
        <Card style={{ backgroundColor: ' #0ba360 ' }} onClick={onClick}>
          <CardContent>
            <div>{icon}</div>
            <div>
              <Typography variant="h6" style={{ color: '#fff', marginBottom: '8px' }}>
                {title}
              </Typography>
              <Typography variant="subtitle1" style={{ color: '#FFD95A', marginBottom: '8px', fontSize: '16px' }}>
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

export default function MyComponent({ handleCardClick }) {
  const [data, setData] = useState({ activeStudentCount: 0, totalStudentCount: 0, totalTeacherCount: 0 });

  const fetchData = async () => {
    try {
      const studentsSnapshot = await get(ref(database, 'Students'));
      const instructorsSnapshot = await get(ref(database, 'Instructors'));
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

      setData({ activeStudentCount, totalStudentCount, totalTeacherCount });
    } catch (error) {
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
          onClick={() => handleCardClick('ManageUser')}
        />
        <WidgetCard
          title="Manage Teachers"
          description="Number of Available Teachers"
          stats={data.totalTeacherCount}
          icon={<i className="ti-harddrives" />}
          onClick={() => handleCardClick('ManageTeachers')}
        />
        <WidgetCard
          title="Manage Students"
          description="Total number of Students"
          stats={data.totalStudentCount}
          icon={<i className="ti-user" />}
          onClick={() => handleCardClick('ManageStudents')}
        />
      </Grid>
    </div>
  );
}
