package ru.neoflex.nfcore.dataset.impl

import org.eclipse.emf.ecore.EClass
import ru.neoflex.nfcore.application.ApplicationFactory
import ru.neoflex.nfcore.base.services.Context
import ru.neoflex.nfcore.base.util.DocFinder
import ru.neoflex.nfcore.dataset.DataType
import ru.neoflex.nfcore.dataset.DatasetFactory
import ru.neoflex.nfcore.dataset.DatasetPackage
import ru.neoflex.nfcore.dataset.DatasetGrid
import ru.neoflex.nfcore.dataset.Filter
import ru.neoflex.nfcore.dataset.JdbcDataset
import ru.neoflex.nfcore.dataset.Operations
import ru.neoflex.nfcore.dataset.RowPerPage

class DatasetGridInit {
    static def findOrCreateEObject(EClass eClass, String name) {
        def resources = DocFinder.create(Context.current.store, eClass, [name: name])
                .execute().resourceSet
        return resources.resources.get(0).contents.get(0)
    }

    static def recreateDatasetGrid(String name, String JdbcDataset) {
        def rs = DocFinder.create(Context.current.store, DatasetPackage.Literals.DATASET_GRID, [name: name])
                .execute().resourceSet
        if (rs.resources.empty) {
            def datasetGrid = DatasetFactory.eINSTANCE.createDatasetGrid()
            datasetGrid.name = name
            def dataset = findOrCreateEObject(DatasetPackage.Literals.JDBC_DATASET, JdbcDataset)
            if (dataset) {
                datasetGrid.setDataset(dataset)
            }
            datasetGrid.rowPerPage = RowPerPage.ALL
            rs.resources.add(Context.current.store.createEObject(datasetGrid))
            return rs.resources.get(0).contents.get(0) as DatasetGrid
        }
        else if ((rs.resources.get(0).contents.get(0) as DatasetGrid).dataset == null) {
            def datasetGridRef = Context.current.store.getRef(rs.resources.get(0))
            def datasetGrid = rs.resources.get(0).contents.get(0) as DatasetGrid
            def dataset = findOrCreateEObject(DatasetPackage.Literals.JDBC_DATASET, JdbcDataset)
            if (dataset) {
                datasetGrid.setDataset(dataset)
            }
            datasetGrid.rowPerPage = RowPerPage.ALL
            Context.current.store.updateEObject(datasetGridRef, datasetGrid)
        }
    }

    static def createAllColumn(String name) {
        def rs = DocFinder.create(Context.current.store, DatasetPackage.Literals.DATASET_GRID, [name: name])
                .execute().resourceSet
        if (!rs.resources.empty && (rs.resources.get(0).contents.get(0) as DatasetGrid).column.size() == 0) {
            def datasetGridRef = Context.current.store.getRef(rs.resources.get(0))
            def datasetGrid = rs.resources.get(0).contents.get(0) as DatasetGrid
            if (datasetGrid.dataset) {
                if (datasetGrid.dataset.datasetColumn.size() != 0) {
                    def columns = datasetGrid.dataset.datasetColumn
                    for (int i = 0; i <= columns.size() - 1; ++i) {
                        def rdbmsColumn = DatasetFactory.eINSTANCE.createRdbmsColumn()
                        rdbmsColumn.name = columns[i].name
                        rdbmsColumn.datasetColumn = columns[i]
                        def typography = ApplicationFactory.eINSTANCE.createTypography()
                        typography.name = columns[i].name
                        rdbmsColumn.headerName = typography
                        rdbmsColumn.headerTooltip = "type: " + columns[i].convertDataType
                        rdbmsColumn.filter = columns[i].convertDataType == DataType.DATE || columns[i].convertDataType == DataType.TIMESTAMP
                                ? Filter.DATE_COLUMN_FILTER :
                                columns[i].convertDataType == DataType.INTEGER || columns[i].convertDataType == DataType.DECIMAL
                                        ? Filter.NUMBER_COLUMN_FILTER : Filter.TEXT_COLUMN_FILTER
                        datasetGrid.column.each { c->
                            if (c.name == columns[i].name.toString()) {
                                throw new IllegalArgumentException("Please, change your query in Dataset. It has similar column`s name")
                            }
                        }
                        datasetGrid.column.add(rdbmsColumn)
                    }
                }
            }
            Context.current.store.updateEObject(datasetGridRef, datasetGrid)
        }
    }

    static def createServerFilters(String name, String JdbcDataset) {
        def rs = DocFinder.create(Context.current.store, DatasetPackage.Literals.DATASET_GRID, [name: name])
                .execute().resourceSet
        if (!rs.resources.empty && (rs.resources.get(0).contents.get(0) as DatasetGrid).serverFilter.size() == 0) {
            def datasetGridRef = Context.current.store.getRef(rs.resources.get(0))
            def datasetGrid = rs.resources.get(0).contents.get(0) as DatasetGrid

            def dataset = findOrCreateEObject(DatasetPackage.Literals.JDBC_DATASET, JdbcDataset) as JdbcDataset

            def serverFilter1 = DatasetFactory.eINSTANCE.createCondition()
            def datasetColumn1 = dataset.datasetColumn.find { c -> c.name == "e_id"}
            serverFilter1.setDatasetColumn(datasetColumn1)
            serverFilter1.operation = Operations.LESS_THAN
            serverFilter1.value = 100000
            serverFilter1.enable = true
            datasetGrid.serverFilter.add(serverFilter1)

            def serverFilter2 = DatasetFactory.eINSTANCE.createCondition()
            def datasetColumn2 = dataset.datasetColumn.find { c -> c.name == "e_id"}
            serverFilter2.setDatasetColumn(datasetColumn2)
            serverFilter2.operation = Operations.LESS_THAN
            serverFilter2.value = 4000
            serverFilter2.enable = false
            datasetGrid.serverFilter.add(serverFilter2)

            def serverFilter3 = DatasetFactory.eINSTANCE.createCondition()
            def datasetColumn3 = dataset.datasetColumn.find { c -> c.name == "name"}
            serverFilter3.setDatasetColumn(datasetColumn3)
            serverFilter3.operation = Operations.INCLUDE_IN
            serverFilter3.value = "test"
            serverFilter3.enable = true
            datasetGrid.serverFilter.add(serverFilter3)

            datasetGrid.useServerFilter = true

            Context.current.store.updateEObject(datasetGridRef, datasetGrid)
        }
    }

    DatasetGridInit() {}

}
