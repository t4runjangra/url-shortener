"use client"

import { useState } from "react"

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    setError("")
    setShortUrl("")
    setLoading(true)

    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          originalUrl
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setShortUrl(data.shortUrl);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleCopy() {
    await navigator.clipboard.writeText(shortUrl);
  }

  return (
    <main>
      <h1>
        URL Shortener
      </h1>
      <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="Enter your long URL"
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        {error && <p>{error}</p>}

        {shortUrl && (
          <div>
            <p>Your shortened URL:</p>
            <a href={shortUrl}>{shortUrl}</a>


            <button onClick={handleCopy}>
              Copy
            </button>
          </div>
        )}
      </form>
    </main>
  )
}
