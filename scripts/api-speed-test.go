package main

import (
	"fmt"
	"net/http"
	"sync"
	"time"
)

type APIResult struct {
	Name         string
	URL          string
	ResponseTime time.Duration
	Success      bool
	Error        error
}

type TestStats struct {
	Name            string
	URL             string
	TotalTests      int
	SuccessfulTests int
	FailedTests     int
	TotalTime       time.Duration
	AverageTime     time.Duration
	MinTime         time.Duration
	MaxTime         time.Duration
}

func testAPI(url, name string) APIResult {
	start := time.Now()
	
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	
	resp, err := client.Get(url)
	elapsed := time.Since(start)
	
	if err != nil {
		return APIResult{
			Name:         name,
			URL:          url,
			ResponseTime: elapsed,
			Success:      false,
			Error:        err,
		}
	}
	defer resp.Body.Close()
	
	success := resp.StatusCode >= 200 && resp.StatusCode < 300
	
	return APIResult{
		Name:         name,
		URL:          url,
		ResponseTime: elapsed,
		Success:      success,
		Error:        nil,
	}
}

func runConcurrentTest(api1URL, api1Name, api2URL, api2Name string) (APIResult, APIResult) {
	var wg sync.WaitGroup
	var result1, result2 APIResult
	
	wg.Add(2)
	
	// 并发测试API1
	go func() {
		defer wg.Done()
		result1 = testAPI(api1URL, api1Name)
	}()
	
	// 并发测试API2
	go func() {
		defer wg.Done()
		result2 = testAPI(api2URL, api2Name)
	}()
	
	wg.Wait()
	return result1, result2
}

func updateStats(stats *TestStats, result APIResult) {
	stats.TotalTests++
	stats.TotalTime += result.ResponseTime
	
	if result.Success {
		stats.SuccessfulTests++
	} else {
		stats.FailedTests++
	}
	
	if stats.MinTime == 0 || result.ResponseTime < stats.MinTime {
		stats.MinTime = result.ResponseTime
	}
	
	if result.ResponseTime > stats.MaxTime {
		stats.MaxTime = result.ResponseTime
	}
	
	if stats.SuccessfulTests > 0 {
		stats.AverageTime = stats.TotalTime / time.Duration(stats.SuccessfulTests)
	}
}

func printResult(round int, result1, result2 APIResult) {
	fmt.Printf("第 %d 轮测试:\n", round)
	
	// API1 结果
	if result1.Success {
		fmt.Printf("  %s: ✅ %v\n", result1.Name, result1.ResponseTime)
	} else {
		fmt.Printf("  %s: ❌ %v (错误: %v)\n", result1.Name, result1.ResponseTime, result1.Error)
	}
	
	// API2 结果
	if result2.Success {
		fmt.Printf("  %s: ✅ %v\n", result2.Name, result2.ResponseTime)
	} else {
		fmt.Printf("  %s: ❌ %v (错误: %v)\n", result2.Name, result2.ResponseTime, result2.Error)
	}
	
	// 本轮获胜者
	if result1.Success && result2.Success {
		if result1.ResponseTime < result2.ResponseTime {
			fmt.Printf("  🏆 本轮最快: %s (快 %v)\n", result1.Name, result2.ResponseTime-result1.ResponseTime)
		} else {
			fmt.Printf("  🏆 本轮最快: %s (快 %v)\n", result2.Name, result1.ResponseTime-result2.ResponseTime)
		}
	}
	fmt.Println()
}

func printFinalStats(stats1, stats2 TestStats) {
	fmt.Println("=== 最终统计结果 ===")
	fmt.Printf("\n%s:\n", stats1.Name)
	fmt.Printf("  总测试次数: %d\n", stats1.TotalTests)
	fmt.Printf("  成功次数: %d\n", stats1.SuccessfulTests)
	fmt.Printf("  失败次数: %d\n", stats1.FailedTests)
	fmt.Printf("  成功率: %.1f%%\n", float64(stats1.SuccessfulTests)/float64(stats1.TotalTests)*100)
	if stats1.SuccessfulTests > 0 {
		fmt.Printf("  平均响应时间: %v\n", stats1.AverageTime)
		fmt.Printf("  最快响应时间: %v\n", stats1.MinTime)
		fmt.Printf("  最慢响应时间: %v\n", stats1.MaxTime)
	}
	
	fmt.Printf("\n%s:\n", stats2.Name)
	fmt.Printf("  总测试次数: %d\n", stats2.TotalTests)
	fmt.Printf("  成功次数: %d\n", stats2.SuccessfulTests)
	fmt.Printf("  失败次数: %d\n", stats2.FailedTests)
	fmt.Printf("  成功率: %.1f%%\n", float64(stats2.SuccessfulTests)/float64(stats2.TotalTests)*100)
	if stats2.SuccessfulTests > 0 {
		fmt.Printf("  平均响应时间: %v\n", stats2.AverageTime)
		fmt.Printf("  最快响应时间: %v\n", stats2.MinTime)
		fmt.Printf("  最慢响应时间: %v\n", stats2.MaxTime)
	}
	
	// 总体对比
	fmt.Println("\n=== 性能对比 ===")
	if stats1.SuccessfulTests > 0 && stats2.SuccessfulTests > 0 {
		if stats1.AverageTime < stats2.AverageTime {
			diff := stats2.AverageTime - stats1.AverageTime
			improvement := float64(diff) / float64(stats2.AverageTime) * 100
			fmt.Printf("🏆 总体最快: %s\n", stats1.Name)
			fmt.Printf("   平均快 %v (提升 %.1f%%)\n", diff, improvement)
		} else {
			diff := stats1.AverageTime - stats2.AverageTime
			improvement := float64(diff) / float64(stats1.AverageTime) * 100
			fmt.Printf("🏆 总体最快: %s\n", stats2.Name)
			fmt.Printf("   平均快 %v (提升 %.1f%%)\n", diff, improvement)
		}
	}
}

func main() {
	// API配置
	api1URL := "https://dns.guduyantou.workers.dev/?domain=github.io"
	api1Name := "DNS API"
	api2URL := "https://similarweb.seokey.vip/?domain=github.io"
	api2Name := "SimilarWeb API"
	
	rounds := 10 // 测试轮数
	
	fmt.Println("🚀 开始API性能测试...")
	fmt.Printf("测试轮数: %d\n", rounds)
	fmt.Printf("API 1: %s\n", api1Name)
	fmt.Printf("API 2: %s\n", api2Name)
	fmt.Println("=" + fmt.Sprintf("%*s", 50, "") + "=")
	fmt.Println()
	
	// 初始化统计
	stats1 := TestStats{Name: api1Name, URL: api1URL}
	stats2 := TestStats{Name: api2Name, URL: api2URL}
	
	// 执行测试
	for i := 1; i <= rounds; i++ {
		result1, result2 := runConcurrentTest(api1URL, api1Name, api2URL, api2Name)
		
		printResult(i, result1, result2)
		
		updateStats(&stats1, result1)
		updateStats(&stats2, result2)
		
		// 测试间隔
		if i < rounds {
			time.Sleep(1 * time.Second)
		}
	}
	
	printFinalStats(stats1, stats2)
}
