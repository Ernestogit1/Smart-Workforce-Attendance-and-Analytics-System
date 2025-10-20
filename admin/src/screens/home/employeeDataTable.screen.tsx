import EmployeeDataTable from '../../components/home/employeeDataTable.component'
import EmployeeDataTableLayout from '../../components/layouts/employeeDataTable.layouts'

export default function EmployeeDataTableScreen() {
  return (
    <EmployeeDataTableLayout>
      <EmployeeDataTable />
    </EmployeeDataTableLayout>
  )
}