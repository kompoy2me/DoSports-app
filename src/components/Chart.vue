<Line
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :width="width"
    :height="height"
    :styles="styles"
/>

<script>
import {Line} from 'vue-chartjs/legacy'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
} from 'chart.js'
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
)
export default {
    name: "Chart",
    extends: Line,
    props: {
        chartData: {
        },
        chartId: {
            type: String,
            default: 'line-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            default: 0
        },
        height: {
            type: Number,
            default: 400
        },
        chartOptions: {
            default() {
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                    }
                }
            }
        },
        styles: {
            default() {
                return {
                    marginTop: "15px",
                    padding: "15px",
                    width: "100%",
                    borderRadius: "4px",
                    backgroundColor: "#1A1A27",
                }
            }
        },
    },
    data: () => ({}),
    computed: {},
    methods: {},
    mounted() {
    }
}
</script>

<style lang="scss">
</style>