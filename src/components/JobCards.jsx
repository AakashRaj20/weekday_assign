import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  selectJobs,
  selectLoading,
  filters,
  companyName,
} from "../redux_store/slices/jobsApiSlice";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Typography,
  Link,
  Avatar,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Profile1 from "../assets/profile.webp";
import Profile2 from "../assets/profile2.webp";

const JobCards = () => {
  const companyNameStyle = {
    fontSize: "15px",
    fontWeight: 600,
    letterSpacing: "1px",
    color: "#8b8b8b",
  };

  const jobRoleStyle = {
    fontSize: "20px",
    letterSpacing: "1px",
  };

  const jobLocationStyle = {
    fontSize: "13px",
    letterSpacing: "1px",
    marginBottom: "3px",
  };

  const salaryStyle = {
    fontSize: "15px",
    padding: "0 20px",
    display: "flex",
    gap: "6px",
    alignItem: "center",
    color: "#89919b",
  };

  const referralImages = [
    {
      name: "referal person 1",
      img: Profile1,
    },
    {
      name: "referal person 2",
      img: Profile2,
    },
  ];

  const dispatch = useDispatch();

  const fetchedJobs = useSelector(selectJobs);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchJobs({ limit: 10, offset: 0 }));
  }, []);

  const handleSalaryNull = (minSalary, maxSalary) => {
    if (minSalary === null && maxSalary === null) {
      return "Not Specified";
    } else if (minSalary === null) {
      return `₹${maxSalary} LPA`;
    } else if (maxSalary === null) {
      return `₹${minSalary} LPA`;
    } else {
      return `₹${minSalary} - ${maxSalary} LPA`;
    }
  };

  return isLoading ? (
    <h1>API Loading</h1>
  ) : (
    <>
      <Grid container columnSpacing={10} rowSpacing={5}>
        {fetchedJobs.jdList.map((job, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card
              className="card-animation"
              elevation={3}
              sx={{
                borderRadius: "1.5rem",
                p: { sm: "0.5rem", xl: "1rem 2rem" },
                pb: { xs: "1rem", sm: "auto" },
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box style={{ display: "flex", padding: "20px", gap: "10px" }}>
                <img
                  style={{ width: "35px", height: "35px" }}
                  src={job.logoUrl}
                  alt={`${job.companyName} logo`}
                />
                <Box>
                  <Typography style={companyNameStyle} variant="h6">
                    {job.companyName}
                  </Typography>
                  <Typography
                    className="job-role"
                    style={jobRoleStyle}
                    variant="h6"
                  >
                    {job.jobRole}
                  </Typography>
                  <Typography
                    style={jobLocationStyle}
                    className="job-location"
                    variant="h6"
                  >
                    {job.location}
                  </Typography>
                </Box>
              </Box>
              <Typography style={salaryStyle}>
                Estimated Salary:{" "}
                {handleSalaryNull(job.minJdSalary, job.maxJdSalary)}
                <CheckBoxIcon color="success" />
              </Typography>
              <CardContent
                sx={{
                  maxHeight: "250px",
                  height: "100%",
                  overflow: "hidden",
                  maskImage:
                    "linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255), rgba(255, 255, 255, 0))",
                }}
              >
                <Typography
                  style={{ fontWeight: 500, fontSize: "20px" }}
                  varinat="h6"
                >
                  About Company:
                </Typography>
                <Typography
                  sx={{ fontWeight: 300, fontSize: "15px" }}
                  varinat="body1"
                >
                  {job.jobDetailsFromCompany}
                </Typography>
              </CardContent>

              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  alignItems: "start",
                  marginLeft: "0",
                  padding: "0 18px",
                }}
              >
                <Box sx={{ margin: "15px 0" }}>
                  <Typography
                    sx={{
                      textAlign: "start",
                      color: "#8b8b8b",
                      fontSize: "15px",
                      fontWeight: 500,
                      letterSpacing: "1px",
                    }}
                  >
                    Minimum Experience: <br />
                    <span style={{ color: "black" }}>
                      {job.minExp === null
                        ? "Not Specified"
                        : `${job.minExp} years`}
                    </span>
                  </Typography>
                </Box>
                <Link
                  href={job.jdLink}
                  target="_blank"
                  underline="none"
                  sx={{ width: "100%" }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      display: "flex",
                      gap: "10px",
                      backgroundColor: "#55EFC4",
                      color: "black",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#55EFC4",
                      },
                      py: "0.75rem",
                    }}
                  >
                    <ElectricBoltIcon style={{ color: "yellow" }} /> Easy Apply
                  </Button>
                </Link>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    marginLeft: "0",
                    textTransform: "none",
                    gap: "10px",
                    py: "0.75rem",
                  }}
                >
                  {referralImages.map((referralImage, index) => (
                    <Avatar
                      sx={{
                        width: "30px",
                        height: "30px",
                        filter: "blur(1.3px)",
                      }}
                      key={index}
                      alt={referralImage.name}
                      src={referralImage.img}
                    />
                  ))}
                  Unlock referal asks
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default JobCards;
