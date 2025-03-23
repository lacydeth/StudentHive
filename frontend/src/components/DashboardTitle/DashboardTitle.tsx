import styles from "./DashboardTitle.module.css"
type DashboardTitleProp = {
  subTitle:string,
  title:string,
  icon:string
}
const DashboardTitle = (props: DashboardTitleProp) => {
  return (
    <div className={styles.current}>
      <h1>{props.title}</h1>
      <h3>
        <img src={props.icon} alt="breadcrumb icon" /> / {props.subTitle}
      </h3>
    </div>
  )
}

export default DashboardTitle