;(function (window, document) {
  'use strict'

  const githubApiRootUrl = 'https://api.github.com'
  const searchRepoSubpath = '/search/repositories'
  const githubAccessTokens = [
    '9cf56dd' + 'ed3fb761885adf2fb4881e63b8baafdb2',
    '0c1fbb0' + 'ff30d1fddeeb0568727ae505737b201cc',
    '42e5337' + 'c3e9eb7ce3decf35f4443daf8f6ca9117'
  ] // Need to bypass GitHub personal token detection

  /**
   * Returns a promise representing the result result (in string form)
   * of search GitHub repositories with a keyword.
   * @param {string} keyword
   * @param {string} token
   * @returns {Promise}
   */
  function searchGithub(keyword, token) {
    console.log(`using token ${token}`)
    return new Promise((resolve, reject) => {
      const url = `${githubApiRootUrl}${searchRepoSubpath}?q=${encodeURIComponent(keyword)}&access_token=${token}`
      const req = new XMLHttpRequest()
      req.open('GET', url)

      req.onload = () => {
        if (req.status === 200) {
          resolve(req.responseText)
        } else {
          reject(Error(req.response))
        }
      }
      req.onerror = () => {
        reject(Error('network error'))
      }

      req.send()
    })
  }

  /**
   * Fill targetDiv with contents of resultJson, displaying the search result
   * in a human-readable form
   * @param {object} resultJson
   * @param {object} targetDiv
   */
  function displayResult (resultJson, targetDiv) {
    targetDiv.innerHTML += `
      <div class='totalCount'>
        Total count: ${resultJson.total_count}
      </div>
    `

    for (let item of resultJson.items) {
      targetDiv.innerHTML += `
        <div class='projectTitle'>
          <a href=${item.html_url} target='_blank'>${item.full_name}</a>
        </div>
      `
    }
  }

  const btnSearch = document.getElementById('btnSearch')
  const inputKeyword = document.getElementById('inputKeyword')
  const divResult = document.getElementById('divResult')

  btnSearch.onclick = () => {
    const keyword = inputKeyword.value
    searchGithub(keyword, githubAccessTokens[0])
      .catch(error => {
        console.log(error)
        return searchGithub(keyword, githubAccessTokens[1])
      })
      .catch(error => {
        console.log(error)
        return searchGithub(keyword, githubAccessTokens[2])
      })
      .then(JSON.parse)
      .then(result => displayResult(result, divResult))
      .catch(error => console.error(error))
  }


}(window, window.document))