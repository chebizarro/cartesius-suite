import logging

from lib.servers import OdataServer

# import the config file
import config

from pyslet.odata2.sqlds import SQLTransaction, SQLError
from pyslet.odata2.memds import EntityCollection

app = OdataServer(__name__, config)

@app.function_import('GDELTSchema.GDELT.GetCountByLoc')
def get_count_by_loc(self, params, **extraArgs) :

	#collection = self..root.DataServices['GDELTSchema.GDELT.GetCountByLoc'].OpenCollection()
	
	root = self.EntitySet.OpenCollection()

	query = "SELECT \"ActionGeo_FeatureID\", COUNT(\"ActionGeo_FeatureID\") FROM \"GDELTEntries\" GROUP BY \"ActionGeo_FeatureID\";"

	transaction = SQLTransaction(root.container.dbapi, root.dbc)
	params = root.container.ParamsClass()

	try:
		transaction.begin()
		logging.info("%s; %s", query, unicode(params.params))
		transaction.execute(query, params)

		for row in transaction.cursor :
			print row
			entity = collection.new_entity()
			idx = 0
			for key in entity.iterkeys() :
				ent = entity[key]
				val = row[idx]
				entity[key].set_from_value(row[idx])
				idx+=1

			collection.insert_entity(entity)				

		transaction.commit()

		return collection

	except Exception as e:
		transaction.rollback(e)
	finally:
		transaction.close()
		
		
