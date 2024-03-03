import { fileURLToPath } from 'url'
import axios from 'axios'
import https from "https"
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const url = 'https://appsync-dev-assetsbucket-vh6yrqipll6w.s3-accelerate.amazonaws.com/c82ffe66-9bda-4fa5-a45a-4f7ef918f5e5/01HR25SB95TAZR9N8DM4XNY4Z1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAQJS23Y2PYLFBJAHR%2F20240303%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20240303T124926Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGUaCWV1LXdlc3QtMSJHMEUCIB%2BCKh3J%2FJQsI5FUd9X9jBHlIaaOKs6UV569cNPDQTHWAiEAg3zZHhFTGZPbskW13a2uFMvNqsuGyZVoNHhWYXKUJV8qjwMIXhADGgwwMjA1OTE2NTg2NTUiDFFjKZ2g4WVToy9y%2ByrsAk4Asyj7NTsPjZH2duIcp0jNqCA4Nv6GsH%2FaypNqy%2FnwgPtfWUGv50pIYlmEi9OkZUuf5ipNeXikurcJeZ7Hfv4PMa6a5L2s9RHouc%2BVwoJgbiyY%2BmeOy%2B3qudBBPs1AdowE%2FFyE%2BKe5P5nq81uYKXI0NnDDnTHDRqyGoJlQ3YtBS2vmgZBwRRZ2M%2F%2B379lDNH10%2BsF0cCcbfVdIo7AC2DO%2BiTeZ%2B7gKpXR7B59caOJPmE4OXHhmGi7354YfvOg6Sxq1K9fJjpOdtpX3eYRh5K59ZSH1zZVqnQxBvhtne144QiGchCB3T7uAakSOwpRKqy1Bx1BUWDCuLN4amHp%2F70BwMxDWGE%2FAJIO8ij78B8udQ8MEGAZ2DfTYh7pzwSltmpprON4MGZj4PAs4NE2VBudfrhBL3%2ByUap72q7YxJV%2F6u4Po3CkUfLesSQdf90wYw3gF6LF2El%2F4wA%2BpjI4p%2BsJtre23K9TNz7b4x%2BUw1eORrwY6nQG%2FizAZ4J5tMngiyUr6zLERFby67pJAi8otHoDHUcH51%2FxIQJMce8W0vvh9wyra1cKSrxGW41VeddKGVpP1bbKTKagNhKV9iGGXg6jTh0WyqfpuMx6kTN1gzEmasuCkqVkelWZYcTlkiUo23HUImZXqWODFEAfXj6e%2BJIy82B2qMEtfdkGCNJ0nob3D1yBQFTXuRCOqKY4oNrlWQylW&X-Amz-Signature=fae757763983bf725c11e27c014eeb25529fa20e3d217486ffc62d0b18d88278&X-Amz-SignedHeaders=host&x-amz-acl=public-read&x-id=PutObject'

function put(data, contentType) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method: "PUT", headers: { "Content-Length": new Blob([data]).size, 'Content-Type': contentType } },
      (res) => {
        let responseBody = "";
        res.on("data", (chunk) => {
          console.log('CHUNK', chunk)
          responseBody += chunk;
        });
        res.on("end", () => {
          console.log('END', responseBody)
          resolve(responseBody);
        });
      },
    );
    req.on("error", (err) => {
      console.log("ERR", err)
      reject(err);
    });
    req.write(data);
    req.end();
  });
}

const filePath = path.join(__dirname, '__tests__/data/logo.png')
const file = fs.readFileSync(filePath)

put(file, 'image/png')