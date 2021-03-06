# Catalog service

This service can manipulate with catalog of items. Add or delete products.  
When it is created it will insert simple *catalog* to the database.
Example of *catalog* you can find in file `./scripts/catalog.json`

Port to access: `1001`  
Port to database: `6001`

#### API
| Method | Uniform Resource Name (URN) | Required  parameters | Output | Description |
|:------:|:-----------------------------|:-------------------------------------:|:--------------------:|:--------------------------------------------------|
| POST | /catalog/:username/:token | catalog_data_post | - | Add/Update item in the catalog |
| GET | /catalog | - | Catalog | Get catalog |
| DELETE | /cart/:username/:token | product_id=[string] *or* category=[string] | - | Delete item/category in the catalog |

#### Example
```
SERVICE_ADDRESS=localhost
USER_NAME=admin
PASSWORD=admin
TOKEN=$(curl -X GET ${SERVICE_ADDRESS}:1000/user/${USER_NAME}/${PASSWORD} | jq -r .token)
catalog_data_post=$(cat ./tests/test_post.json)
catalog_data_new=$(cat ./scripts/catalog.json)
WHAT='Content-Type: application/json'
```

Add/Update item:  
`curl -X POST -d "${catalog_data_post}" -H "${WHAT}" ${SERVICE_ADDRESS}:1001/catalog/${USER_NAME}/${TOKEN}`

Get catalog:  
`curl -X GET ${SERVICE_ADDRESS}:1001/catalog`

Insert new catalog:  
`curl -X POST -d "${catalog_data_new}" -H "${WHAT}" ${SERVICE_ADDRESS}:1001/catalog/${USER_NAME}/${TOKEN}`

Delete item:  
`curl -X DELETE -d "product_id=8" ${SERVICE_ADDRESS}:1001/catalog/${USER_NAME}/${TOKEN}`

Delete category:  
`curl -X DELETE -d "category=Fruits" ${SERVICE_ADDRESS}:1001/catalog/${USER_NAME}/${TOKEN}`

#### How to upload image to Azure Blob
Log to Azure: 
```
az login
```  
Get key:
```
blobStorageAccountKey=$(az storage account keys list -g lingi2145.fr \
                        -n myblob9 --query [0].value --output tsv)
```
Create SAS: 
```
IMAGE=[name of image]
SAS=$(az storage blob generate-sas \
                --account-name myblob9 \
                --account-key $blobStorageAccountKey \
                --container-name images \
                --name ${IMAGE} \
                --permissions acdrw \
                --expiry 2020-05-15)
SAS=$(echo $SAS | tr -d '"')
``` 
Upload: 
```
H1="x-ms-date: $(date -u)"
H2="x-ms-blob-type: BlockBlob"
BLOB_ADDRESS=https://myblob9.blob.core.windows.net
curl -X PUT -T ${IMAGE} -H "${H1}" -H "${H2}" "${BLOB_ADDRESS}/images/${IMAGE}?${SAS}"
``` 
Download:
```
curl -X GET "${BLOB_ADDRESS}/images/${IMAGE}" --output myDownloadedImage.jpg
``` 