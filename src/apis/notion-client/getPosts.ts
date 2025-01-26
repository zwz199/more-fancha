import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"
import { randamAccessUrls} from "src/custom"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  const response = await api.getPage(id)
  id = idToUuid(id)
  const collection = Object.values(response.collection)[0]?.value
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value

  // Check Type
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  } else {
    // Construct Data
    const pageIds = getAllPageIds(response)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null
      if(properties['标题']){
        properties['title'] = properties['标题']
      }
      if(properties['短链']){
        properties['slug'] = properties['短链']
      }
      if(properties['状态']){
        properties['status'] = properties['状态']
      }
      if(properties['类型']){
        properties['type'] = properties['类型']
      }
      if(properties['类别']){
        properties['category'] = properties['类别']
      }
      if(properties['标签']){
        properties['tags'] = properties['标签']
      }
      if(properties['摘要']){
        properties['summary'] = properties['摘要']
      }
      if(properties['缩图']){
        properties.thumbnail = properties['缩图']
      }
      if(properties["随机访问外链"]){
        randamAccessUrls.push(properties["随机访问外链"])
      }
      properties.date = {};
      properties.date['start_date'] = new Date(
        block[id].value?.last_edited_time
      ).toString()
      // Add fullwidth, createdtime to properties
      properties.createdTime = new Date(
        block[id].value?.created_time
      ).toString()
      properties.fullWidth =
        (block[id].value?.format as any)?.page_full_width ?? false

      data.push(properties)
    }



    const posts = data as TPosts
    return posts
  }
}
